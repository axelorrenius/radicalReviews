import { toHaveAccessibleErrorMessage } from "@testing-library/jest-dom/matchers"
import { Typeahead } from "react-bootstrap-typeahead"

type TagsComponentProps = {
    setTags: (tag: string[]) => void
}

function TagsComponent(props: TagsComponentProps) {
    const { setTags } = props

    return (
        <Typeahead
            allowNew
            id="custom-selections-example"
            multiple
            newSelectionPrefix="Add a new tag "
            options={[]}
            onChange={(selected) => {
                const tags = selected as any[]
                const labels = tags.map((t) => t.label)
                setTags(labels)
            }}
            placeholder={
                "Relevant tags for your question (e.g. 'Java', 'Search Tree', 'Assignment 1')"
            }
        ></Typeahead>
    )
}

export default TagsComponent
