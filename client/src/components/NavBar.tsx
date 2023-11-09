import React, { useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import "./searchBar.css"
import Modal from "react-bootstrap/Modal"
import { useAuth } from "./authContext"

// Include Bootstrap CSS classes (assuming you've included Bootstrap in your project)
import "bootstrap/dist/css/bootstrap.min.css"
import LoginModal from "./loginModal"
import { Typeahead } from "react-bootstrap-typeahead"
import { InternalAPI, QueryResult } from "../api/api"

type NavbarProps = {
    toggleSideMenu: () => void
}

const server = new InternalAPI()

const NavBar = (props: NavbarProps) => {
    // search stuff
    const history = useHistory()
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<QueryResult[]>([])    
    const typeaheadRef = React.useRef<any>(null)
    
    const [showModal, setShowModal] = useState(false)
    const openModal = () => {
        setShowModal(true)
    }
    const { logout, authenticatedUser, selectedSchool, selectedCourse } = useAuth()    
    const searchPlaceholder = () => {
        if (selectedCourse?.id) {
            return `Search within ${selectedCourse.courseCode}...`
        }
        if (selectedSchool?.id) {
            return `Search within ${selectedSchool.schoolName}...`
        }
        return "Search..."
    }

    const filterBy = () => true

    const search = (query: string) => {
        if (query.length < 2) return
        setIsSearching(true)

        if (!selectedSchool?.id) return
        const queryDTO = {
            query: query,
            schoolId: selectedSchool?.id,
            courseId: selectedCourse?.id
        }
        server.search(queryDTO).then((result) => {
            setSearchResults(result)
            setIsSearching(false)
        }).catch((error) => {
            setIsSearching(false) 
            setSearchResults([])
        })
    }

    const navigate = (item: any) => {
        console.log(item)
        switch (item.entityType) {
            case "thread":
                history.push(`/thread/${item.entityId}`)
                break
            case "course":
                history.push(`/course/${item.entityId}`)
                break
        }
        setTimeout(() => {
            setSearchResults([])
            typeaheadRef.current.clear()
        }, 10)


    }

    const menuItems = [
        {
            title: "Schools",
            pageURL: "/",
            requiresAdmin: false
        },
        {
            title: "Courses",
            pageURL: "/courses"
        }
    ]

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Link to="/" className="navbar-brand">
                Scourse
            </Link>



                
            { selectedSchool && (
                <div className="search-bar px-5">
                    <Typeahead
                        ref={typeaheadRef}
                        id="basic-typeahead-single"
                        filterBy={filterBy}
                        labelKey="description"
                        placeholder={searchPlaceholder()}
                        options={searchResults}
                        isLoading={isSearching}
                        onInputChange={search}
                        renderMenuItemChildren={(option: any) => (
                            <>
                                <div style={{width: "100%"}} onClick={() => navigate(option)}>
                                    <span>{option.description}</span>
                                </div>
                            </>
                        )}
                        />
                </div>
            )}
            <div className="collapse navbar-collapse" id="navbarNav">
                { selectedSchool && (
                    <ul className="navbar-nav mr-auto">
                        {menuItems.map(({ title, pageURL }) => (
                            <li className="nav-item" key={title}>
                                <Link to={pageURL} className="nav-link">
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {authenticatedUser ? (
                    <div className="ms-auto d-flex align-items-center">
                        <span className="navbar-text px-4">
                            <Link to="/user" className="nav-link">
                                {authenticatedUser.username}
                            </Link>
                        </span>
                        <button
                            className="btn btn-outline-light px-4"
                            onClick={logout}
                            >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="ms-auto d-flex align-items-center">
                        <button
                            className="btn btn-outline-light px-4"
                            onClick={openModal}
                            >
                            Login
                        </button>
                    </div>
                )}
            </div>
            <LoginModal show={showModal} onClose={() => setShowModal(false)} />
        </nav>
    )
}

export default NavBar
