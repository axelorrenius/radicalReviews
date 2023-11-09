import { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"

import "font-awesome/css/font-awesome.min.css" // Import the Font Awesome CSS
import { InternalAPI, PostDTO, ThreadDTO } from "../api/api"
import { useParams } from "react-router-dom"
import CreatePostModal from "./addPostModal"
import PostComponent from "./post"
import Breadcrumbs from "./breadcrumbs"
import { useAuth } from "./authContext"
import { useToasts } from "react-bootstrap-toasts"

interface RouteParams {
    threadId: string // Define the type of courseId here
}

const Post = () => {
    const server = new InternalAPI()
    const context = useAuth()

    const { threadId } = useParams<RouteParams>()
    const threadIdNum = parseInt(threadId)

    const [thread, setThread] = useState<ThreadDTO | null>(null)
    const [sortedPosts, setSortedPost] = useState<PostDTO[] | []>([])
    const [newPost, setNewPost] = useState("") // Track the new comment text
    const [showAddPostModal, setShowAddPostModal] = useState(false)


    const fetchThread = async () => {
        server
            .getThread(threadIdNum)
            .then((result) => {
                setThread(result)
            })
            .catch((err) => console.error(err))
    }

    // placeholder image
    const profileImage = "https://images.app.goo.gl/NqMtK4qsE9hk2tih6"

    useEffect(() => {
        fetchThread()
    }, [threadIdNum])

    // Function to handle upvoting the question
    const upvoteQuestion = () => {
        if (!thread || !thread.id) return
        server
            .upVoteThread(thread.id)
            .then((result) => {
                setThread({ ...thread, upVotes: thread.upVotes + 1 })
            })
            .catch((err) => console.error(err))
    }

    // Function to handle downvoting the question
    const downvoteQuestion = () => {
        if (!thread || !thread.id) return

        server
            .downVoteThread(thread.id)
            .then((result) => {
                setThread({ ...thread, downVotes: thread.downVotes + 1 })
            })
            .catch((err) => console.error(err))
    }

    // Function to handle upvoting a comment
    const upvotePost = (threadId: number, postId: number) => {
        server
            .upVotePost(threadId, postId)
            .then((result) => {
                const updatedPosts = sortedPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, upVotes: post.upVotes + 1 }
                    }
                    return post
                })

                setSortedPost(updatedPosts)
            })
            .catch((err) => console.error(err))
    }

    // Function to handle downvoting a comment
    const downvotePost = (threadId: number, postId: number) => {
        server.downVotePost(threadId, postId).then((result) => {
            const updatedComments = sortedPosts.map((comment) => {
                if (comment.id === postId) {
                    return { ...comment, downVotes: comment.downVotes + 1 }
                }
                return comment
            })

            setSortedPost(updatedComments)
        })
    }

    // Function to show the "Add Comment" modal
    const showAddPost = () => {
        setShowAddPostModal(true)
    }

    // Function to close the "Add Comment" modal
    const closeAddPost = () => {
        setShowAddPostModal(false)
        fetchThread()
    }

    // Sort comments whenever sortedComments or post.comments change
    useEffect(() => {
        if (!thread) return
        const sorted = [...thread.posts].sort(
            (a, b) => b.upVotes - b.downVotes - (a.upVotes - a.downVotes)
        )
        setSortedPost(sorted)
    }, [thread?.posts])

    if (!thread) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <>
            <Breadcrumbs school={context.selectedSchool} course={context.selectedCourse} thread={thread} />
            <div style={{marginLeft: "10vw", marginRight: "10vw"}}>
                <Button
                    onClick={showAddPost}
                    variant="primary"
                    style={{
                        marginLeft: "10px"
                    }}
                    className="custom-btn"
                >
                    Answer
                </Button>
                <div className="thread">
                    <PostComponent
                        onClick={() => () => null}
                        key={thread.id}
                        votes={thread.upVotes - thread.downVotes}
                        showContent={true}
                        title={thread.title}
                        content={thread.content}
                        tags={thread.tags}
                        postedBy={"Unknown"}
                        postedAt={thread.createdAt}
                        level={0}
                        onDownVote={() => downvoteQuestion()}
                        onUpVote={() => upvoteQuestion()}
                        isMain={true}
                    />
                </div>
                <div className="posts">
                    {sortedPosts.map((post) => (
                        <PostComponent
                            onClick={() => null}
                            key={post.id}
                            votes={post.upVotes - post.downVotes}
                            showContent={true}
                            title={""}
                            content={post.content}
                            tags={[]}
                            postedBy={post.user.username || "Unknown"}
                            postedAt={post.createdAt ?? new Date()}
                            level={post.user.lvl ?? 0}
                            onDownVote={() => downvotePost(threadIdNum, post.id as number)}
                            onUpVote={() => upvotePost(threadIdNum, post.id as number)}
                            isMain={false}
                        />
                        ))}
                </div>
                <Button
                    onClick={showAddPost}
                    variant="primary"
                    style={{
                        marginLeft: "10px"
                    }}
                    className="custom-btn"
                >
                    Answer
                </Button>
                <CreatePostModal
                    thread={thread}
                    show={showAddPostModal}
                    onDone={(post) => {
                        closeAddPost()
                    }}
                />
            </div>
        </>
    )
}

export default Post
