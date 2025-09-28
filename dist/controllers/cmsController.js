"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CMSController {
    static async getContentBlocks(req, res, next) {
        try {
            const { section } = req.query;
            const where = section ? { section: section } : {};
            const blocks = await prisma.contentBlock.findMany({
                where: {
                    ...where,
                    isActive: true
                },
                orderBy: { sortOrder: 'asc' }
            });
            const parsedBlocks = blocks.map((block) => ({
                ...block,
                title: JSON.parse(block.title),
                content: JSON.parse(block.content),
                metadata: block.metadata ? JSON.parse(block.metadata) : null
            }));
            const response = {
                success: true,
                data: parsedBlocks,
                message: 'Content blocks retrieved successfully'
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async createContentBlock(req, res, next) {
        try {
            const { key, title, content, type, section, sortOrder, metadata } = req.body;
            if (!key || !title || !content || !type || !section) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: key, title, content, type, section'
                });
            }
            const block = await prisma.contentBlock.create({
                data: {
                    key,
                    title: JSON.stringify(title),
                    content: JSON.stringify(content),
                    type,
                    section,
                    sortOrder: sortOrder || 0,
                    metadata: metadata ? JSON.stringify(metadata) : null
                }
            });
            const parsedBlock = {
                ...block,
                title: JSON.parse(block.title),
                content: JSON.parse(block.content),
                metadata: block.metadata ? JSON.parse(block.metadata) : null
            };
            const response = {
                success: true,
                data: parsedBlock,
                message: 'Content block created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateContentBlock(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { title, content, type, section, sortOrder, metadata, isActive } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid content block ID'
                });
            }
            const updateData = {};
            if (title)
                updateData.title = JSON.stringify(title);
            if (content)
                updateData.content = JSON.stringify(content);
            if (type)
                updateData.type = type;
            if (section)
                updateData.section = section;
            if (sortOrder !== undefined)
                updateData.sortOrder = sortOrder;
            if (metadata)
                updateData.metadata = JSON.stringify(metadata);
            if (isActive !== undefined)
                updateData.isActive = isActive;
            const block = await prisma.contentBlock.update({
                where: { id },
                data: updateData
            });
            const parsedBlock = {
                ...block,
                title: JSON.parse(block.title),
                content: JSON.parse(block.content),
                metadata: block.metadata ? JSON.parse(block.metadata) : null
            };
            const response = {
                success: true,
                data: parsedBlock,
                message: 'Content block updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteContentBlock(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid content block ID'
                });
            }
            await prisma.contentBlock.delete({
                where: { id }
            });
            const response = {
                success: true,
                data: null,
                message: 'Content block deleted successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getSiteSettings(req, res, next) {
        try {
            const { group } = req.query;
            const where = group ? { group: group } : {};
            const settings = await prisma.siteSetting.findMany({
                where: {
                    ...where,
                    isActive: true
                },
                orderBy: { key: 'asc' }
            });
            const parsedSettings = settings.map((setting) => ({
                ...setting,
                value: setting.type === 'json' ? JSON.parse(setting.value) : setting.value,
                label: JSON.parse(setting.label)
            }));
            const response = {
                success: true,
                data: parsedSettings,
                message: 'Site settings retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async upsertSiteSetting(req, res, next) {
        try {
            const { key, value, type, group, label } = req.body;
            if (!key || !value || !type || !group || !label) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: key, value, type, group, label'
                });
            }
            const settingValue = type === 'json' ? JSON.stringify(value) : value;
            const setting = await prisma.siteSetting.upsert({
                where: { key },
                update: {
                    value: settingValue,
                    type,
                    group,
                    label: JSON.stringify(label)
                },
                create: {
                    key,
                    value: settingValue,
                    type,
                    group,
                    label: JSON.stringify(label)
                }
            });
            const parsedSetting = {
                ...setting,
                value: setting.type === 'json' ? JSON.parse(setting.value) : setting.value,
                label: JSON.parse(setting.label)
            };
            const response = {
                success: true,
                data: parsedSetting,
                message: 'Site setting saved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getPages(req, res, next) {
        try {
            const pages = await prisma.page.findMany({
                where: { isPublished: true },
                orderBy: { sortOrder: 'asc' }
            });
            const parsedPages = pages.map((page) => ({
                ...page,
                title: JSON.parse(page.title),
                content: JSON.parse(page.content),
                metaTitle: page.metaTitle ? JSON.parse(page.metaTitle) : null,
                metaDesc: page.metaDesc ? JSON.parse(page.metaDesc) : null
            }));
            const response = {
                success: true,
                data: parsedPages,
                message: 'Pages retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createPage(req, res, next) {
        try {
            const { slug, title, content, metaTitle, metaDesc, template, sortOrder } = req.body;
            if (!slug || !title || !content) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: slug, title, content'
                });
            }
            const page = await prisma.page.create({
                data: {
                    slug,
                    title: JSON.stringify(title),
                    content: JSON.stringify(content),
                    metaTitle: metaTitle ? JSON.stringify(metaTitle) : null,
                    metaDesc: metaDesc ? JSON.stringify(metaDesc) : null,
                    template: template || 'default',
                    sortOrder: sortOrder || 0
                }
            });
            const parsedPage = {
                ...page,
                title: JSON.parse(page.title),
                content: JSON.parse(page.content),
                metaTitle: page.metaTitle ? JSON.parse(page.metaTitle) : null,
                metaDesc: page.metaDesc ? JSON.parse(page.metaDesc) : null
            };
            const response = {
                success: true,
                data: parsedPage,
                message: 'Page created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updatePage(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { title, content, metaTitle, metaDesc, template, sortOrder, isPublished } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid page ID'
                });
            }
            const updateData = {};
            if (title)
                updateData.title = JSON.stringify(title);
            if (content)
                updateData.content = JSON.stringify(content);
            if (metaTitle)
                updateData.metaTitle = JSON.stringify(metaTitle);
            if (metaDesc)
                updateData.metaDesc = JSON.stringify(metaDesc);
            if (template)
                updateData.template = template;
            if (sortOrder !== undefined)
                updateData.sortOrder = sortOrder;
            if (isPublished !== undefined)
                updateData.isPublished = isPublished;
            const page = await prisma.page.update({
                where: { id },
                data: updateData
            });
            const parsedPage = {
                ...page,
                title: JSON.parse(page.title),
                content: JSON.parse(page.content),
                metaTitle: page.metaTitle ? JSON.parse(page.metaTitle) : null,
                metaDesc: page.metaDesc ? JSON.parse(page.metaDesc) : null
            };
            const response = {
                success: true,
                data: parsedPage,
                message: 'Page updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getMenuItems(req, res, next) {
        try {
            const menuItems = await prisma.menuItem.findMany({
                where: { isActive: true, parentId: null },
                include: {
                    children: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy: { sortOrder: 'asc' }
            });
            const parsedMenuItems = menuItems.map((item) => ({
                ...item,
                title: JSON.parse(item.title),
                children: item.children.map((child) => ({
                    ...child,
                    title: JSON.parse(child.title)
                }))
            }));
            const response = {
                success: true,
                data: parsedMenuItems,
                message: 'Menu items retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getNews(req, res, next) {
        try {
            const { limit = 10, published = 'true' } = req.query;
            const where = published === 'true' ? { isPublished: true } : {};
            const news = await prisma.newsPost.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit)
            });
            const parsedNews = news.map((post) => ({
                ...post,
                title: JSON.parse(post.title),
                excerpt: post.excerpt ? JSON.parse(post.excerpt) : null,
                content: JSON.parse(post.content),
                metaTitle: post.metaTitle ? JSON.parse(post.metaTitle) : null,
                metaDesc: post.metaDesc ? JSON.parse(post.metaDesc) : null,
                tags: post.tags ? JSON.parse(post.tags) : null
            }));
            const response = {
                success: true,
                data: parsedNews,
                message: 'News retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.CMSController = CMSController;
//# sourceMappingURL=cmsController.js.map