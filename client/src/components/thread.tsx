import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

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
              <span>{post.votes}</span>
              <Button onClick={upvoteQuestion} variant="link">
                <i className="fa fa-arrow-up" /> {/* Up arrow */}
              </Button>
              <Button onClick={downvoteQuestion} variant="link">
                <i className="fa fa-arrow-down" /> {/* Down arrow */}
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
              <span>{comment.votes}</span>
              <Button onClick={() => upvoteComment(comment.id)} variant="link">
              <i className="fa fa-arrow-up" style={{ color: 'green' }} /> {/* Up arrow */}
              </Button>
              <Button onClick={() => downvoteComment(comment.id)} variant="link">
                <i className="fa fa-arrow-down" style={{ color: 'red' }} /> {/* Down arrow */}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Post;
