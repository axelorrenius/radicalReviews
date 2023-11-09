import { Button, Col, Row } from "react-bootstrap"
import { PersonCircle, CalendarEventFill, PersonFill, ArrowDownCircleFill, ArrowUpCircleFill } from "react-bootstrap-icons"
import styled from "styled-components"


type PostComponentProps = {
    onClick: () => void
    showContent: boolean
    title: string
    postedBy: string
    postedAt: Date
    content: string
    tags: string[]
    votes: number
    level?: number
    isMain: boolean
    onUpVote: () => void
    onDownVote: () => void
}

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-left: 10px;
`

const Tag = styled.span`
    background-color: rgb(var(--bs-primary-rgb));
    color: #fff;
    padding: 4px 8px;
    margin-right: 5px;
    margin-bottom: 5px; // Space between tags
    border-radius: 4px;
    font-size: 14px;
`

function PostComponent(props: PostComponentProps) {
    const { onClick, onDownVote, onUpVote, isMain, title, postedBy, postedAt, level, content, tags, showContent, votes } = props
    
    const showTags = tags.length > 0
    const contentWidth = showTags ? 5 : 9
    const tagWidth = showTags ? 4 : 0

    return (
        <>
            <Row onClick={() => onClick()} style={{margin: "10px", background: "#EEEEEE", borderRadius: "10px", padding: "10px", border: isMain ? "solid 1px black" : undefined}}>
                <Col xs={1} style={{ display:"flex", alignItems: "center", justifyContent: "center" }}>
                    <div>
                        {isMain ? <span>Question</span> : <></>}
                        <PersonCircle size={64} color="gray" />
                        {level ? <span>Level {level}</span> : <></>}
                    </div>
                </Col>
                <Col xs={2} style={{ display:"flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{fontSize: "1.5rem"}}>
                        <ArrowUpCircleFill color="rgb(var(--bs-primary-rgb))" onClick={() => onUpVote()}/>
                        {` ${votes} `}
                        <ArrowDownCircleFill color="rgb(var(--bs-primary-rgb))" onClick={() => onDownVote()}/>
                    </span>
                </Col>
                <Col xs={contentWidth}>
                    <div>
                        <span style={{fontSize: "0.8rem"}}>
                            <span><PersonFill style={{marginRight: "5px"}} />{postedBy ? postedBy : "Anonymous"}</span>
                            {postedAt ? <span><CalendarEventFill style={{marginRight: "5px", marginLeft: "5px"}} />{new Date(postedAt).toDateString()}</span> : <></>}
                        </span>
                    </div>
                    <div>
                        <h6>{title}</h6>
                    </div>
                    <div>
                        <p>{showContent ? content : ""}</p>
                    </div>
                </Col>
                <Col cs={tagWidth}>
                    <Tags>
                        {tags &&
                            tags.map((tag, index) => (
                                <Tag style={{fontSize: "0.8rem"}} key={index}>{tag}</Tag>
                                ))}
                    </Tags>
                </Col>
            </Row>
        </>
    )
}

export default PostComponent
