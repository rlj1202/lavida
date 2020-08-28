import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import User from '../models/User.model';
import Board from '../models/Board.model';
import Post from '../models/Post.model';
import IPost from '../interfaces/IPost';
import IBoard from '../interfaces/IBoard';

export default function Rest(app: Router) {
    var router = Router();

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

    router.get('/posts/:id', async (req: Request, res: Response) => {
        var post = await Post.findOne({
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

    app.use('/api', router);
};