import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'font-awesome/css/font-awesome.min.css'; // Import the Font Awesome CSS
import { InternalAPI, PostDTO, ThreadDTO } from '../api/api';
import { useParams } from 'react-router-dom';

interface RouteParams {
  threadId: string; // Define the type of courseId here
}

const Post = () => {
  const server = new InternalAPI();

  const { threadId } = useParams<RouteParams>();
  const threadIdNum = parseInt(threadId);

  const [thread, setThread] = useState<ThreadDTO | null>(null);
  const [sortedPosts, setSortedPost] = useState<PostDTO[] | []>([]);
  const [newPost, setNewPost] = useState(''); // Track the new comment text
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const fetchThread = async () => {
    // const thread = server.getThread(threadIdNum).then(result => {
    //   setThread(result);
    // }).catch(err => console.error(err));
    const thread = {
      id: 1,
      courseId: 1,
      title: 'Introduction to Programming',
      upVotes: 10,
      downVotes: 2,
      content: 'This thread is about the basics of programming.',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-16'),
      posts: [{
        id: 1,
        user: {
          id: 1,
          username: 'John Doe',
          lvl: 1,
          title: 'Beginner',
        },
        threadId: 1,
        content: 'This is the content of the first post.',
        upVotes: 10,
        downVotes: 2,
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-16'),
        comments: [],
      },
      {
        id: 2,
        user: {
          id: 2,
          username: 'MR smart boi',
          lvl: 1337,
          title: 'Smort at math',
        },
        threadId: 2,
        content: 'Second post content goes here.',
        upVotes: 8999,
        downVotes: 1,
        createdAt: new Date('2023-01-18'),
        updatedAt: new Date('2023-01-19'),
        comments: [],
      },
      {
        threadId: 3, // No 'id' provided for this post
        user: {
          id: 3,
          username: 'teacher',
          lvl: 3,
          title: 'Always learning',
        },
        content: 'This is another post without an ID.',
        upVotes: 5,
        downVotes: 0,
        createdAt: new Date('2023-01-20'),
        updatedAt: new Date('2023-01-21'),
        comments: [], // No comments for this post
      },],
      tags: ['Programming', 'Beginner'],
    }
    setThread(thread);
  };


  // placeholder image
  const profileImage = 'https://images.app.goo.gl/NqMtK4qsE9hk2tih6'


  useEffect(() => {
    fetchThread();
  }, [threadIdNum]);

  // Function to handle upvoting the question
  const upvoteQuestion = () => {
    if (!thread || !thread.id) return
    server.upVoteThread(thread.id).then(result => {
      setThread({ ...thread, upVotes: thread.upVotes + 1 });
    }).catch(err => console.error(err));
  };

  // Function to handle downvoting the question
  const downvoteQuestion = () => {
    if (!thread || !thread.id) return

    server.downVoteThread(thread.id).then(result => {
      setThread({ ...thread, downVotes: thread.downVotes + 1 });
    }).catch(err => console.error(err));
  };

  // Function to handle upvoting a comment
  const upvotePost = (threadId: number, postId: number) => {
    server.upVotePost(threadId, postId).then(result => {

      const updatedPosts = sortedPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, upVotes: post.upVotes + 1 };
        }
        return post;
      });

      setSortedPost(updatedPosts);
    }).catch(err => console.error(err));
  };

  // Function to handle downvoting a comment
  const downvotePost = (threadId: number, postId: number) => {
    server.downVotePost(threadId, postId).then(result => {
      const updatedComments = sortedPosts.map((comment) => {
        if (comment.id === postId) {
          return { ...comment, downVotes: comment.downVotes + 1 };
        }
        return comment;
      });

      setSortedPost(updatedComments);
    })
  };

  // Function to show the "Add Comment" modal
  const showAddPost = () => {
    setShowAddPostModal(true);
  };

  // Function to close the "Add Comment" modal
  const closeAddPost = () => {
    setShowAddPostModal(false);
  };

  // Function to add a new comment
  const addPost = () => {
    if (newPost.trim() !== '') {
      const newPostObj: PostDTO = {
        threadId: threadIdNum,
        user: {
          id: 1,
          username: 'John Doe',
          lvl: 1,
          title: 'Beginner',
        },
        content: newPost,
        upVotes: 0,
        downVotes: 0,
        comments: []
      };

      server.savePost(newPostObj).then(post => {
        if (!thread) return;
        setNewPost('');
        closeAddPost();

        setThread({ ...thread, posts: [...thread.posts, post] });
        // setSortedPost([...sortedPosts, post]); // Include the new comment in the sorted list
      }).catch(err => console.error(err));
      // const updatedComments = [...thread?.posts, newPost];
    }
  };

  // Sort comments whenever sortedComments or post.comments change
  useEffect(() => {
    if (!thread) return
    const sorted = [...thread.posts].sort((a, b) => (b.upVotes - b.downVotes) - (a.upVotes - a.downVotes));
    setSortedPost(sorted);
  }, [thread?.posts]);


  if (!thread) {
    return <div><p>Loading...</p></div>;
  }

  return (
    <div className="thread">
      <Card>
        <Card.Body>
          <Card.Title>{thread.title}</Card.Title>
          <div>
            <div className="votes">
              <Button onClick={upvoteQuestion} variant="link">
                <i className="fa fa-arrow-up" /> {/* Up arrow with red color */}
              </Button>
              <span>{thread.upVotes - thread.downVotes}</span>
              <Button onClick={downvoteQuestion} variant="link">
                <i className="fa fa-arrow-down"/> {/* Down arrow with red color */}
              </Button>
              <Button onClick={showAddPost} variant="link">
                <i className="fa fa-comment" />
              </Button>
            </div>
          </div>
        </Card.Body>  
      </Card>

      <ListGroup className="posts">
        {sortedPosts.map((post) => (
          <ListGroup.Item key={post.id}>
            <div className="user-info">
              <img src={profileImage} alt="User" />
              <div className="user-details">
                <div className="username" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {post.user.username} - {`Level ${post.user.lvl}`} - {post.user.title}
                </div>
              </div>
            </div>
            <div className="post-content" style={{ marginTop: '10px' }}>
              {post.content}
            </div>
            <div className="votes">
              <Button onClick={() => upvotePost(threadIdNum, post.id as number)} variant="link">
                <i className="fa fa-arrow-up" style={{ color: 'green' }} /> {/* Up arrow with red color */}
              </Button>
              <span>{post.upVotes - post.downVotes}</span>
              <Button onClick={() => downvotePost(threadIdNum, post.id as number)} variant="link">
                <i className="fa fa-arrow-down" style={{ color: 'red' }} /> {/* Down arrow with red color */}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Comment Modal */}
      <Modal show={showAddPostModal} onHide={closeAddPost}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows={1}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Add a new comment..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddPost}>
            Close
          </Button>
          <Button variant="primary" onClick={addPost}>
            Add Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Post;
