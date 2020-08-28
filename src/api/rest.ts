import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import User from '../models/User.model';
import Board from '../models/Board.model';
import Post from '../models/Post.model';

export default function Rest(app: Router) {
    var router = Router();

    // XXX
    router.get('/hello', async (req: Request, res: Response) => {
        var users = await User.findAll();
        res.json(users);
    });

    router.get('/board/:name', async (req: Request, res: Response) => {
        var board = await Board.findOne({
            include: [ Post ],
            where: {
                name: req.params.name
            }
        });

        if (!board) {
            res.status(500).send('no such board');
            return;
        }

        res.json({
            title: board.title,
            description: board.description,
            posts: board.posts.map(post => { return {
                title: post.title,
                content: post.content
            }})
        });
    });

    app.use('/api', router);
};