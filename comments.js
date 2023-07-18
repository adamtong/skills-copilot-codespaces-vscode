// create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// create comments object
const commentsByPostId = {};

// handle event from event-bus
app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;

        // create comments array if postId not exists
        const comments = commentsByPostId[postId] || [];
        comments.push({ id, content, status: 'pending' });
        commentsByPostId[postId] = comments;

        // send event to event-bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id,
                content,
                postId,
                status: 'pending'
            }
        });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        // find comments array
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });

        // update status
        comment.status = status;

        // send event to event-bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                postId,
                status
            }
        });
    }

    res.send({});
});

// get all comments by postId
app.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const comments = commentsByPostId[id] || [];

    res.send(comments);
});

// listen for requests
app.listen(4001, () => {
    console.log('Listening on 4001');
});

