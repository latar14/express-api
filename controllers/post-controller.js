const {prisma} = require('../prisma/prisma-client');


const PostController = {

    createPost: async (req, res) => {

        const { content } = req.body;

        const authorId = req.user.userId;

        if (!content) {

            return res.status(400).json({error: "Все поля обязательны"})
        }

        try {
            const post = await prisma.post.create({
                data: {
                    content,
                    authorId
                }
            })

            res.json(post);

        } catch (error) {

            console.error('Create posr error');

            res.status(500).json({error: 'Internal server error'});
        }
    },
    getAllPosts: async (req, res) => {
        const userId = req.user.userId;

        try {
            const posts = await prisma.post.findMany({
                include: {
                    likes: true,
                    author: true,
                    comments: true
                },
                orderBy: {
                    createdAt: 'desc' // сортировка по убыванию
                }
            })
            // 
            const postWithLikeInfo = posts.map(post => ({
                ...post,
                likeByUser: post.likes.some(like => like.userId === userId) // 
            }))

            res.json(postWithLikeInfo);

        } catch (error) {
            console.error('Get all posts error');

            res.status(500).json({error: 'Internal server error'});
        }
    },
    getPostById: async (req, res) => {

        const { id } = req.params;
        const userId = req.user.userId;

        try {
            const post = await prisma.post.findUnique({
                where: {id},
                include: {
                    comments: {
                        include: {
                            user: true
                        }
                    },
                    likes: true,
                    author: true
                }
            })

        if (!post) {
            res.status(404).json({error: 'Пост не найден'})
        }
        // Лайк текущего пользователя
        const postWithLikeInfo = {
            ...post, 
            likeByUser: post.likes.some(like => like.userId === userId)
        }
        res.json(postWithLikeInfo);

        } catch (error) {

            console.error('Get post by id error', error)

            res.status(500).json({error: 'Internal server error'})
        }
    },
    deletePost: async (req, res) => {

        const {id} = req.params;

        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            res.status(404).json({error: 'Пост не найден'})
        }

        if (post.authorId !== req.user.id) {

            return res.status(403).json({error: 'Нет доступа'})

        }
        try {
            // удаление из нескольких баз данных
            const transaction = await prisma.$transaction([
                prisma.comment.deleteMany({where: { postId: id}}),
                prisma.like.deleteMany({where: { postId: id}}),
                prisma.post.delete({
                    where: { id }
                })
            ])
        } catch (error) {

            console.error('Delete post error', error)

            res.status(500).json({error: 'Internal server error'})
        }
    }
}

module.exports = PostController;