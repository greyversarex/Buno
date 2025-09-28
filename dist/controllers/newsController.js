"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsStats = exports.getNewsletterSubscribers = exports.subscribeNewsletter = exports.deleteNews = exports.updateNews = exports.createNews = exports.getAllNewsAdmin = exports.getNewsById = exports.getNewsBySlug = exports.getAllNews = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllNews = async (req, res) => {
    try {
        const { page = 1, limit = 9, category, sort = 'newest', featured, search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const where = {
            isPublished: true
        };
        if (category && category !== 'all') {
            where.category = category;
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        let orderBy;
        switch (sort) {
            case 'oldest':
                orderBy = { publishedAt: 'asc' };
                break;
            case 'popular':
                orderBy = { views: 'desc' };
                break;
            case 'newest':
            default:
                orderBy = { publishedAt: 'desc' };
                break;
        }
        const totalCount = await prisma.news.count({ where });
        const news = await prisma.news.findMany({
            where,
            orderBy,
            take: limitNum,
            skip: offset
        });
        let featured_news = null;
        if (pageNum === 1 && !category && !search) {
            featured_news = await prisma.news.findFirst({
                where: {
                    isPublished: true,
                    isFeatured: true
                },
                orderBy: { publishedAt: 'desc' }
            });
        }
        const totalPages = Math.ceil(totalCount / limitNum);
        res.json({
            success: true,
            data: {
                news,
                featured: featured_news,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limitNum,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news'
        });
    }
};
exports.getAllNews = getAllNews;
const getNewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const news = await prisma.news.findUnique({
            where: { slug }
        });
        if (!news || !news.isPublished) {
            res.status(404).json({
                success: false,
                error: 'News article not found'
            });
            return;
        }
        await prisma.news.update({
            where: { id: news.id },
            data: { views: { increment: 1 } }
        });
        res.json({
            success: true,
            data: news
        });
    }
    catch (error) {
        console.error('Error fetching news by slug:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news article'
        });
    }
};
exports.getNewsBySlug = getNewsBySlug;
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await prisma.news.findUnique({
            where: { id: parseInt(id) }
        });
        if (!news || !news.isPublished) {
            res.status(404).json({
                success: false,
                error: 'News article not found'
            });
            return;
        }
        await prisma.news.update({
            where: { id: news.id },
            data: { views: { increment: 1 } }
        });
        res.json({
            success: true,
            data: news
        });
    }
    catch (error) {
        console.error('Error fetching news by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news article'
        });
    }
};
exports.getNewsById = getNewsById;
const getAllNewsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status = 'all', search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const where = {};
        if (category && category !== 'all') {
            where.category = category;
        }
        if (status === 'published') {
            where.isPublished = true;
        }
        else if (status === 'draft') {
            where.isPublished = false;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        const totalCount = await prisma.news.count({ where });
        const news = await prisma.news.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limitNum,
            skip: offset
        });
        const totalPages = Math.ceil(totalCount / limitNum);
        res.json({
            success: true,
            data: {
                news,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limitNum,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching admin news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news'
        });
    }
};
exports.getAllNewsAdmin = getAllNewsAdmin;
const createNews = async (req, res) => {
    try {
        const { title, content, excerpt, category, image, images, tags, author, isPublished, isFeatured, slug, metaTitle, metaDescription, readTime } = req.body;
        let finalSlug = slug;
        if (!finalSlug) {
            const titleText = typeof title === 'string' ? title : JSON.parse(title).ru || JSON.parse(title).en;
            finalSlug = titleText.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();
        }
        const existingNews = await prisma.news.findUnique({
            where: { slug: finalSlug }
        });
        if (existingNews) {
            finalSlug = `${finalSlug}-${Date.now()}`;
        }
        const news = await prisma.news.create({
            data: {
                title,
                content,
                excerpt,
                category,
                image,
                images: images ? JSON.stringify(images) : null,
                tags: tags ? JSON.stringify(tags) : null,
                author: author || 'Bunyod-Tour',
                isPublished: isPublished || false,
                isFeatured: isFeatured || false,
                slug: finalSlug,
                metaTitle,
                metaDescription,
                readTime: readTime || null
            }
        });
        res.status(201).json({
            success: true,
            data: news
        });
    }
    catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create news article'
        });
    }
};
exports.createNews = createNews;
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.slug) {
            const existingNews = await prisma.news.findFirst({
                where: {
                    slug: updateData.slug,
                    NOT: { id: parseInt(id) }
                }
            });
            if (existingNews) {
                updateData.slug = `${updateData.slug}-${Date.now()}`;
            }
        }
        if (updateData.images && Array.isArray(updateData.images)) {
            updateData.images = JSON.stringify(updateData.images);
        }
        if (updateData.tags && Array.isArray(updateData.tags)) {
            updateData.tags = JSON.stringify(updateData.tags);
        }
        const news = await prisma.news.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json({
            success: true,
            data: news
        });
    }
    catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update news article'
        });
    }
};
exports.updateNews = updateNews;
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.news.delete({
            where: { id: parseInt(id) }
        });
        res.json({
            success: true,
            message: 'News article deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete news article'
        });
    }
};
exports.deleteNews = deleteNews;
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });
    }
    catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to subscribe to newsletter'
        });
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const getNewsletterSubscribers = async (req, res) => {
    try {
        res.json({
            success: true,
            data: []
        });
    }
    catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch newsletter subscribers'
        });
    }
};
exports.getNewsletterSubscribers = getNewsletterSubscribers;
const getNewsStats = async (req, res) => {
    try {
        const totalNews = await prisma.news.count();
        const publishedNews = await prisma.news.count({
            where: { isPublished: true }
        });
        const draftNews = await prisma.news.count({
            where: { isPublished: false }
        });
        const featuredNews = await prisma.news.count({
            where: { isFeatured: true }
        });
        const newsWithViews = await prisma.news.aggregate({
            _sum: {
                views: true
            }
        });
        const mostViewed = await prisma.news.findFirst({
            orderBy: { views: 'desc' },
            select: {
                id: true,
                title: true,
                views: true
            }
        });
        res.json({
            success: true,
            data: {
                totalNews,
                publishedNews,
                draftNews,
                featuredNews,
                totalViews: newsWithViews._sum.views || 0,
                mostViewed
            }
        });
    }
    catch (error) {
        console.error('Error fetching news stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news statistics'
        });
    }
};
exports.getNewsStats = getNewsStats;
//# sourceMappingURL=newsController.js.map