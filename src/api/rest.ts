import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';

import User from '../models/User.model';
import Post from '../models/Post.model';
import Board from '../models/Board.model';
import Comment from '../models/Comment.model';

import IUser from '../interfaces/IUser';
import IPost from '../interfaces/IPost';
import IBoard from '../interfaces/IBoard';
import IComment from '../interfaces/IComment';
import IPagination from '../interfaces/IPagination';

function isAuthed(req: Request, res: Response, next: NextFunction) {
    var user = req.session?.user as IUser;
    if (user) {
        next();
    } else {
        next(new Error('not authed'));
    }
}

export default function Rest(app: Router) {
    var router = Router();

    // board
    router.get('/boards', async (req: Request, res: Response) => {
        var boards = await Board.findAll();

        if (!boards) {
            res.status(404).send('no boards');
            return;
        }

        res.json(boards.map(board => board as IBoard));
    });
    router.get('/boards/:name', async (req: Request, res: Response) => {
        var board = await Board.findOne({
            where: {
                name: req.params.name
            }
        });

        if (!board) {
            res.status(404).send('no such board');
            return;
        }

        res.json(board as IBoard);
    });
    router.get('/boards/:name/posts', async (req: Request, res: Response) => {
        var board = await Board.findOne({
            // include: [ Post ],
            where: {
                name: req.params.name
            }
        });

        if (!board) {
            res.status(404).send('no such board');
            return;
        }

        var posts = await Post.findAll({
            include: [ User ],
            where: {
                boardId: board.id
            },
            order: [ [ 'createdAt', 'DESC' ] ],
            // limit: 0,
            // offset: 0
        }) as IPost[];

        // var posts = board.posts as IPost[];

        var offset = 0;
        var limit = posts.length;

        if (req.query.page) {
            var page = req.query.page ? parseInt(req.query.page as string) : 0;
            var perPage = req.query.per_page ? parseInt(req.query.per_page as string) : 10;

            offset = page * perPage;
            limit = perPage;
        }

        //res.json(posts.slice(offset, offset + limit));
        var result = {
            offset,
            limit,
            count: posts.slice(offset, offset + limit).length,
            total: posts.length,
            items: posts.slice(offset, offset + limit)
        } as IPagination<IPost>;
        res.json(result);
    });
    router.post('/boards/:name/posts', isAuthed, async (req: Request, res: Response) => {
        var board = await Board.findOne({
            where: {
                name: req.params.name
            }
        });

        if (!board) {
            res.status(404).send('no such board');
            return;
        }

        var user = req.session?.user as IUser;
        var data = req.body as IPost;
        data.authorId = user.id;
        data.boardId = board.id;

        var post = Post.build(data);
        await post.save();

        res.redirect(`/board/${board.name}`);
    });

    // post
    router.get('/posts/:id', async (req: Request, res: Response) => {
        var post = await Post.findOne({
            include: [ Board, User ],
            where: {
                id: req.params.id
            }
        });

        if (!post) {
            res.status(404).send('no such post');
            return;
        }

        res.json(post as IPost);
    });
    router.get('/posts/:id/comments', async (req: Request, res: Response) => {
        var comments = await Comment.findAll({
            include: [ User ],
            where: {
                postId: req.params.id
            }
        });

        if (!comments) {
            res.status(404).send('no comments');
            return;
        }

        res.json(comments as IComment[]);
    });
    router.post('/posts/:id/comments', isAuthed, async (req: Request, res: Response) => {
        var user = req.session?.user as IUser;
        var data = req.body as IComment;
        data.postId = parseInt(req.params.id);
        data.authorId = user.id;

        var comment = Comment.build(data);
        await comment.save();

        res.json();
    });
    router.post('/posts', isAuthed, async (req: Request, res: Response) => {
        var user = req.session?.user as IUser;
        var data = req.body as IPost;
        data.authorId = user.id;

        var post = Post.build(data);
        await post.save();

        res.json();
    });

    // comment
    router.get('/comments/:id', async (req: Request, res: Response) => {
        var comment = await Comment.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!comment) {
            res.status(404).send('no such comment');
            return;
        }

        res.json(comment as IComment);
    });

    app.use('/api', router);
};