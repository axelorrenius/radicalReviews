import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'font-awesome/css/font-awesome.min.css'; // Import the Font Awesome CSS

// Define a basic post structure with question, comments, and votes
const initialPost = {
  id: 1,
  question: 'What is your favorite programming language?',
  comments: [
    { id: 1, text: 'I love JavaScript!', votes: 5 },
    { id: 2, text: 'Python is the best!', votes: 8 },
    { id: 3, text: 'C++ all the way!', votes: 3 },
  ],
  votes: 0,
};

const Post = () => {
  const [post, setPost] = useState(initialPost);
  const [sortedComments, setSortedComments] = useState(post.comments);
  const [newComment, setNewComment] = useState(''); // Track the new comment text
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  // Function to handle upvoting the question
  const upvoteQuestion = () => {
    setPost({ ...post, votes: post.votes + 1 });
  };

  // Function to handle downvoting the question
  const downvoteQuestion = () => {
    setPost({ ...post, votes: post.votes - 1 });
  };

  // Function to handle upvoting a comment
  const upvoteComment = (commentId:number) => {
    const updatedComments = sortedComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, votes: comment.votes + 1 };
      }
      return comment;
    });
    setSortedComments(updatedComments);
  };

  // Function to handle downvoting a comment
  const downvoteComment = (commentId:number) => {
    const updatedComments = sortedComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, votes: comment.votes - 1 };
      }
      return comment;
    });
    setSortedComments(updatedComments);
  };

  // Function to show the "Add Comment" modal
  const showAddComment = () => {
    setShowAddCommentModal(true);
  };

  // Function to close the "Add Comment" modal
  const closeAddComment = () => {
    setShowAddCommentModal(false);
  };

  // Function to add a new comment
  const addComment = () => {
    if (newComment.trim() !== '') {
      const newCommentObj = {
        id: Date.now(), // Generate a unique ID (you can use a better method)
        text: newComment,
        votes: 0,
      };
      const updatedComments = [...post.comments, newCommentObj];
      setPost({ ...post, comments: updatedComments });
      setSortedComments([...sortedComments, newCommentObj]); // Include the new comment in the sorted list
      setNewComment('');
      closeAddComment();
    }
  };

  // Sort comments whenever sortedComments or post.comments change
  useEffect(() => {
    const sorted = [...sortedComments].sort((a, b) => b.votes - a.votes);
    setSortedComments(sorted);
  }, [sortedComments, post.comments]);

  return (
    <div className="post">
      <Card>
        <Card.Body>
          <Card.Title>{post.question}</Card.Title>
          <Card.Text>
            <div className="votes">
              <Button onClick={upvoteQuestion} variant="link">
                <i className="fa fa-arrow-up" /> {/* Up arrow with red color */}
              </Button>
              <span>{post.votes}</span>
              <Button onClick={downvoteQuestion} variant="link">
                <i className="fa fa-arrow-down"/> {/* Down arrow with red color */}
              </Button>
              <Button onClick={showAddComment} variant="link">
                <i className="fa fa-comment" />
              </Button>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>

      <ListGroup className="comments">
        {sortedComments.map((comment) => (
          <ListGroup.Item key={comment.id}>
            {comment.text}
            <div className="votes">
              <Button onClick={() => upvoteComment(comment.id)} variant="link">
                <i className="fa fa-arrow-up" style={{ color: 'green' }} /> {/* Up arrow with red color */}
              </Button>
              <span>{comment.votes}</span>
              <Button onClick={() => downvoteComment(comment.id)} variant="link">
                <i className="fa fa-arrow-down" style={{ color: 'red' }} /> {/* Down arrow with red color */}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Comment Modal */}
      <Modal show={showAddCommentModal} onHide={closeAddComment}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows={1}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a new comment..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddComment}>
            Close
          </Button>
          <Button variant="primary" onClick={addComment}>
            Add Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Post;
