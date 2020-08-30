import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';

import User from '../models/User.model';
import Board from '../models/Board.model';
import Post from '../models/Post.model';
import IPost from '../interfaces/IPost';
import IBoard from '../interfaces/IBoard';
import Comment from '../models/Comment.model';
import IComment from '../interfaces/IComment';
import { IUser } from '../interfaces/IUser';

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
            order: [ [ 'createdAt', 'DESC' ] ]
        }) as IPost[];

        // var posts = board.posts as IPost[];

        if (req.query.page) {
            var page = parseInt(req.query.page as string);
            var perPage = req.query.perPage ? parseInt(req.query.perPage as string) : 10;
    
            var start = page * perPage;
    
            posts = posts.slice(start, start + perPage);
        }

        res.json(posts);
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