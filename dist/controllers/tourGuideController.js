"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuideDocument = exports.uploadGuideDocuments = exports.uploadGuideAvatar = exports.updateGuideProfile = exports.createTourGuideProfile = exports.leaveGuideReview = exports.collectReviews = exports.finishTour = exports.startTour = exports.getTourDetails = exports.getGuideTours = exports.loginTourGuide = exports.upload = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tour-guide-secret-key';
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path_1.default.join(process.cwd(), 'uploads', 'guides');
        try {
            await promises_1.default.mkdir(uploadPath, { recursive: true });
        }
        catch (error) {
            console.error('Error creating upload directory:', error);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Неподдерживаемый тип файла. Разрешены: JPG, PNG, WEBP, PDF, DOC, DOCX'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
const loginTourGuide = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            res.status(400).json({
                success: false,
                message: 'Логин и пароль обязательны'
            });
            return;
        }
        const guide = await prisma.guide.findFirst({
            where: { login },
            select: {
                id: true,
                name: true,
                login: true,
                password: true,
                contact: true,
                isActive: true
            }
        });
        if (!guide) {
            res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
            return;
        }
        if (!guide.isActive) {
            res.status(403).json({
                success: false,
                message: 'Аккаунт деактивирован'
            });
            return;
        }
        let validPassword = false;
        if (!guide.password) {
            res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
            return;
        }
        try {
            validPassword = await bcrypt_1.default.compare(password, guide.password);
        }
        catch (error) {
            console.warn('⚠️ Legacy password check for guide:', guide.login);
            validPassword = password === guide.password;
            if (validPassword) {
                try {
                    const hashedPassword = await bcrypt_1.default.hash(password, 10);
                    await prisma.guide.update({
                        where: { id: guide.id },
                        data: { password: hashedPassword }
                    });
                    console.log('✅ Password migrated to hash for guide:', guide.login);
                }
                catch (updateError) {
                    console.error('❌ Failed to migrate password to hash:', updateError);
                }
            }
        }
        if (!validPassword) {
            res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: guide.id,
            login: guide.login,
            name: guide.name,
            type: 'tour-guide'
        }, JWT_SECRET, { expiresIn: '24h' });
        console.log('🔑 Tour guide login successful:', guide.login);
        res.json({
            success: true,
            token,
            guide: {
                id: guide.id,
                name: guide.name,
                login: guide.login,
                email: guide.contact ? (typeof guide.contact === 'string' ? JSON.parse(guide.contact).email : guide.contact.email) : null,
                phone: guide.contact ? (typeof guide.contact === 'string' ? JSON.parse(guide.contact).phone : guide.contact.phone) : null
            },
            message: 'Авторизация успешна'
        });
    }
    catch (error) {
        console.error('❌ Tour guide login error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.loginTourGuide = loginTourGuide;
const getGuideTours = async (req, res) => {
    try {
        const guideId = req.user?.id;
        if (!guideId) {
            res.status(401).json({
                success: false,
                message: 'Не авторизован'
            });
            return;
        }
        const tours = await prisma.tour.findMany({
            where: {
                isActive: true,
                tourGuides: {
                    some: {
                        guideId: guideId
                    }
                }
            },
            include: {
                bookings: {
                    where: { status: { in: ['paid', 'confirmed'] } }
                },
                category: true,
                tourBlock: true
            },
            orderBy: {
                scheduledStartDate: 'asc'
            }
        });
        const toursWithStats = tours.map(tour => {
            const totalTourists = tour.bookings.reduce((sum, booking) => {
                return sum + booking.numberOfTourists;
            }, 0);
            return {
                id: tour.id,
                uniqueCode: tour.uniqueCode,
                title: tour.title,
                scheduledStartDate: tour.scheduledStartDate,
                scheduledEndDate: tour.scheduledEndDate,
                status: tour.status,
                totalTourists,
                bookingsCount: tour.bookings.length,
                category: tour.category,
                tourBlock: tour.tourBlock
            };
        });
        console.log(`📋 Found ${tours.length} tours for guide ${guideId}`);
        res.json({
            success: true,
            data: toursWithStats
        });
    }
    catch (error) {
        console.error('❌ Error getting guide tours:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.getGuideTours = getGuideTours;
const getTourDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const guideId = req.user?.id;
        const tourId = parseInt(id);
        if (!tourId) {
            res.status(400).json({
                success: false,
                message: 'ID тура обязателен'
            });
            return;
        }
        const tour = await prisma.tour.findFirst({
            where: {
                id: tourId,
                isActive: true,
                tourGuides: {
                    some: {
                        guideId: guideId
                    }
                }
            },
            include: {
                bookings: {
                    where: { status: { in: ['paid', 'confirmed'] } },
                    include: {
                        tour: true,
                        hotel: true
                    }
                },
                category: true,
                tourBlock: true,
                reviews: {
                    where: { isApproved: true }
                },
                guideReviews: {
                    where: { guideId: guideId }
                },
                tourGuides: {
                    include: {
                        guide: true
                    }
                }
            }
        });
        if (!tour) {
            res.status(404).json({
                success: false,
                message: 'Тур не найден'
            });
            return;
        }
        const tourists = [];
        tour.bookings.forEach(booking => {
            if (booking.tourists) {
                try {
                    const bookingTourists = JSON.parse(booking.tourists);
                    bookingTourists.forEach((tourist) => {
                        tourists.push({
                            ...tourist,
                            bookingId: booking.id,
                            contactEmail: booking.contactEmail,
                            contactPhone: booking.contactPhone
                        });
                    });
                }
                catch (e) {
                    console.warn('Error parsing tourists data:', e);
                }
            }
        });
        const tourDetails = {
            id: tour.id,
            uniqueCode: tour.uniqueCode,
            title: tour.title,
            description: tour.description,
            itinerary: tour.itinerary,
            scheduledStartDate: tour.scheduledStartDate,
            scheduledEndDate: tour.scheduledEndDate,
            status: tour.status,
            bookings: tour.bookings,
            tourists: tourists,
            totalTourists: tourists.length,
            category: tour.category,
            tourBlock: tour.tourBlock,
            reviews: tour.reviews,
            guideReview: tour.guideReviews[0] || null
        };
        res.json({
            success: true,
            data: tourDetails
        });
    }
    catch (error) {
        console.error('❌ Error getting tour details:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.getTourDetails = getTourDetails;
const startTour = async (req, res) => {
    try {
        const { id } = req.params;
        const guideId = req.user?.id;
        const tourId = parseInt(id);
        const tour = await prisma.tour.findFirst({
            where: {
                id: tourId,
                assignedGuideId: guideId,
                status: 'pending'
            }
        });
        if (!tour) {
            res.status(404).json({
                success: false,
                message: 'Тур не найден или уже начат'
            });
            return;
        }
        const updatedTour = await prisma.tour.update({
            where: { id: tourId },
            data: {
                status: 'active'
            }
        });
        console.log(`🚀 Tour ${tourId} started by guide ${guideId}`);
        res.json({
            success: true,
            data: updatedTour,
            message: 'Тур начат'
        });
    }
    catch (error) {
        console.error('❌ Error starting tour:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.startTour = startTour;
const finishTour = async (req, res) => {
    try {
        const { id } = req.params;
        const guideId = req.user?.id;
        const tourId = parseInt(id);
        const tour = await prisma.tour.findFirst({
            where: {
                id: tourId,
                assignedGuideId: guideId,
                status: 'active'
            }
        });
        if (!tour) {
            res.status(404).json({
                success: false,
                message: 'Тур не найден или не активен'
            });
            return;
        }
        const updatedTour = await prisma.tour.update({
            where: { id: tourId },
            data: {
                status: 'finished'
            }
        });
        console.log(`✅ Tour ${tourId} finished by guide ${guideId}`);
        res.json({
            success: true,
            data: updatedTour,
            message: 'Тур завершён'
        });
    }
    catch (error) {
        console.error('❌ Error finishing tour:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.finishTour = finishTour;
const collectReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { selectedTourists } = req.body;
        const guideId = req.user?.id;
        const tourId = parseInt(id);
        if (!selectedTourists || !Array.isArray(selectedTourists)) {
            res.status(400).json({
                success: false,
                message: 'Список туристов обязателен'
            });
            return;
        }
        const tour = await prisma.tour.findFirst({
            where: {
                id: tourId,
                assignedGuideId: guideId,
                status: 'finished'
            }
        });
        if (!tour) {
            res.status(404).json({
                success: false,
                message: 'Тур не найден или не завершён'
            });
            return;
        }
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        let emailsSent = 0;
        for (const tourist of selectedTourists) {
            if (tourist.email) {
                try {
                    const reviewLink = `${process.env.FRONTEND_URL}/review/${tourId}?tourist=${encodeURIComponent(tourist.email)}`;
                    await transporter.sendMail({
                        from: process.env.EMAIL_FROM,
                        to: tourist.email,
                        subject: 'Оставьте отзыв о туре',
                        html: `
              <h2>Здравствуйте, ${tourist.name}!</h2>
              <p>Благодарим вас за участие в туре "${JSON.parse(tour.title).ru}".</p>
              <p>Мы будем благодарны, если вы поделитесь своими впечатлениями:</p>
              <a href="${reviewLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Оставить отзыв</a>
            `
                    });
                    emailsSent++;
                }
                catch (emailError) {
                    console.warn('Failed to send email to:', tourist.email, emailError);
                }
            }
        }
        console.log(`📧 Sent ${emailsSent} review request emails for tour ${tourId}`);
        res.json({
            success: true,
            emailsSent,
            message: `Отправлено ${emailsSent} писем с просьбой оставить отзыв`
        });
    }
    catch (error) {
        console.error('❌ Error collecting reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.collectReviews = collectReviews;
const leaveGuideReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const guideId = req.user?.id;
        const tourId = parseInt(id);
        if (!content || content.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Текст отзыва обязателен'
            });
            return;
        }
        const tour = await prisma.tour.findFirst({
            where: {
                id: tourId,
                assignedGuideId: guideId,
                status: 'finished'
            }
        });
        if (!tour) {
            res.status(404).json({
                success: false,
                message: 'Тур не найден или не завершён'
            });
            return;
        }
        const existingReview = await prisma.guideReview.findUnique({
            where: {
                tourId_guideId: {
                    tourId: tourId,
                    guideId: guideId
                }
            }
        });
        let review;
        if (existingReview) {
            review = await prisma.guideReview.update({
                where: { id: existingReview.id },
                data: { content: content.trim() }
            });
        }
        else {
            review = await prisma.guideReview.create({
                data: {
                    tourId: tourId,
                    guideId: guideId,
                    content: content.trim()
                }
            });
        }
        console.log(`💬 Guide review ${existingReview ? 'updated' : 'created'} for tour ${tourId}`);
        res.json({
            success: true,
            data: review,
            message: 'Отзыв сохранён'
        });
    }
    catch (error) {
        console.error('❌ Error leaving guide review:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.leaveGuideReview = leaveGuideReview;
const createTourGuideProfile = async (req, res) => {
    try {
        const { name, description, login, password, email, phone, languages, experience, isActive } = req.body;
        const files = req.files;
        console.log('📝 Получены данные для создания гида:', req.body);
        console.log('📁 Получены файлы:', files);
        if (!name || !email || !languages) {
            res.status(400).json({
                success: false,
                message: 'Имя, email и языки обязательны'
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        let photoPath = null;
        if (files && files.avatar && files.avatar[0]) {
            photoPath = files.avatar[0].path;
            console.log('📷 Аватар сохранен:', photoPath);
        }
        let documentsArray = [];
        if (files && files.documents && files.documents.length > 0) {
            documentsArray = files.documents.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
            console.log('📄 Документы сохранены:', documentsArray.length);
        }
        const guide = await prisma.guide.create({
            data: {
                name: name,
                description: description || 'Профессиональный гид',
                languages: languages,
                contact: JSON.stringify({ email, phone }),
                experience: experience ? parseInt(experience) : 0,
                rating: 5.0,
                login: login,
                password: hashedPassword,
                isActive: isActive === 'true' || isActive === true,
                photo: photoPath,
                documents: documentsArray.length > 0 ? JSON.stringify(documentsArray) : null
            }
        });
        console.log('✅ Новый гид создан в таблице Guide:', guide.id);
        res.status(201).json({
            success: true,
            data: {
                id: guide.id,
                name: guide.name,
                description: guide.description,
                languages: guide.languages,
                contact: guide.contact,
                experience: guide.experience,
                rating: guide.rating,
                isActive: guide.isActive,
                photo: guide.photo,
                documents: guide.documents
            },
            message: 'Гид успешно создан с загруженными файлами'
        });
    }
    catch (error) {
        console.error('❌ Ошибка создания гида:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.createTourGuideProfile = createTourGuideProfile;
const updateGuideProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, email, phone, languages, experience, isActive } = req.body;
        const files = req.files;
        const guideId = parseInt(id);
        console.log('📝 Получены данные для обновления гида:', req.body);
        console.log('📁 Получены файлы:', files);
        if (!guideId) {
            res.status(400).json({
                success: false,
                message: 'ID гида обязателен'
            });
            return;
        }
        const existingGuide = await prisma.guide.findUnique({
            where: { id: guideId }
        });
        if (!existingGuide) {
            res.status(404).json({
                success: false,
                message: 'Гид не найден'
            });
            return;
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description)
            updateData.description = description;
        if (languages)
            updateData.languages = languages;
        if (experience !== undefined)
            updateData.experience = parseInt(experience);
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (email || phone) {
            const currentContact = existingGuide.contact ? JSON.parse(existingGuide.contact) : {};
            updateData.contact = JSON.stringify({
                email: email || currentContact.email,
                phone: phone || currentContact.phone
            });
        }
        if (files && files.avatar && files.avatar[0]) {
            updateData.photo = files.avatar[0].path;
            console.log('📷 Аватар обновлен:', files.avatar[0].path);
        }
        if (files && files.documents && files.documents.length > 0) {
            const documentsArray = files.documents.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype
            }));
            let existingDocuments = [];
            try {
                existingDocuments = existingGuide.documents ? JSON.parse(existingGuide.documents) : [];
            }
            catch (e) {
                existingDocuments = [];
            }
            const allDocuments = [...existingDocuments, ...documentsArray];
            updateData.documents = JSON.stringify(allDocuments);
            console.log('📄 Документы обновлены, всего:', allDocuments.length);
        }
        const updatedGuide = await prisma.guide.update({
            where: { id: guideId },
            data: updateData
        });
        console.log('✅ Профиль гида обновлен:', guideId);
        res.json({
            success: true,
            data: {
                id: updatedGuide.id,
                name: updatedGuide.name,
                description: updatedGuide.description,
                languages: updatedGuide.languages,
                contact: updatedGuide.contact,
                experience: updatedGuide.experience,
                isActive: updatedGuide.isActive,
                photo: updatedGuide.photo,
                documents: updatedGuide.documents
            },
            message: 'Профиль гида успешно обновлен с файлами'
        });
    }
    catch (error) {
        console.error('❌ Ошибка обновления гида:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.updateGuideProfile = updateGuideProfile;
const uploadGuideAvatar = async (req, res) => {
    try {
        const { id } = req.params;
        const guideId = parseInt(id);
        if (!guideId) {
            res.status(400).json({
                success: false,
                message: 'ID гида обязателен'
            });
            return;
        }
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'Файл аватара не загружен'
            });
            return;
        }
        const avatarPath = `/uploads/guides/${req.file.filename}`;
        const updatedGuide = await prisma.guide.update({
            where: { id: guideId },
            data: { avatar: avatarPath }
        });
        console.log('✅ Аватар гида обновлен:', guideId, avatarPath);
        res.json({
            success: true,
            data: {
                avatarPath,
                guide: updatedGuide
            },
            message: 'Аватар успешно загружен'
        });
    }
    catch (error) {
        console.error('❌ Ошибка загрузки аватара:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка загрузки аватара: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.uploadGuideAvatar = uploadGuideAvatar;
const uploadGuideDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const guideId = parseInt(id);
        if (!guideId) {
            res.status(400).json({
                success: false,
                message: 'ID гида обязателен'
            });
            return;
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Документы не загружены'
            });
            return;
        }
        const existingGuide = await prisma.guide.findUnique({
            where: { id: guideId }
        });
        let existingDocuments = [];
        if (existingGuide?.documents) {
            try {
                existingDocuments = JSON.parse(existingGuide.documents);
            }
            catch (e) {
                console.warn('Error parsing existing documents:', e);
            }
        }
        const newDocuments = req.files.map((file) => ({
            name: file.originalname,
            path: `/uploads/guides/${file.filename}`,
            type: file.mimetype,
            size: file.size,
            uploadedAt: new Date().toISOString()
        }));
        const allDocuments = [...existingDocuments, ...newDocuments];
        const updatedGuide = await prisma.guide.update({
            where: { id: guideId },
            data: { documents: JSON.stringify(allDocuments) }
        });
        console.log('✅ Документы гида загружены:', guideId, newDocuments.length);
        res.json({
            success: true,
            data: {
                documents: allDocuments,
                newDocuments,
                guide: updatedGuide
            },
            message: `Загружено ${newDocuments.length} документов`
        });
    }
    catch (error) {
        console.error('❌ Ошибка загрузки документов:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка загрузки документов: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.uploadGuideDocuments = uploadGuideDocuments;
const deleteGuideDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { documentPath } = req.body;
        const guideId = parseInt(id);
        if (!guideId || !documentPath) {
            res.status(400).json({
                success: false,
                message: 'ID гида и путь к документу обязательны'
            });
            return;
        }
        const existingGuide = await prisma.guide.findUnique({
            where: { id: guideId }
        });
        if (!existingGuide) {
            res.status(404).json({
                success: false,
                message: 'Гид не найден'
            });
            return;
        }
        let documents = [];
        if (existingGuide.documents) {
            try {
                documents = JSON.parse(existingGuide.documents);
            }
            catch (e) {
                console.warn('Error parsing documents:', e);
            }
        }
        const updatedDocuments = documents.filter((doc) => doc.path !== documentPath);
        const updatedGuide = await prisma.guide.update({
            where: { id: guideId },
            data: { documents: JSON.stringify(updatedDocuments) }
        });
        try {
            const fullPath = path_1.default.join(process.cwd(), documentPath);
            await promises_1.default.unlink(fullPath);
            console.log('✅ Файл удален с диска:', fullPath);
        }
        catch (fileError) {
            console.warn('⚠️ Не удалось удалить файл с диска:', fileError);
        }
        res.json({
            success: true,
            data: {
                documents: updatedDocuments,
                guide: updatedGuide
            },
            message: 'Документ успешно удален'
        });
    }
    catch (error) {
        console.error('❌ Ошибка удаления документа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка удаления документа: ' + (error instanceof Error ? error.message : 'Unknown error')
        });
    }
};
exports.deleteGuideDocument = deleteGuideDocument;
//# sourceMappingURL=tourGuideController.js.map