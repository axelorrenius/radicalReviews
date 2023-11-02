import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./searchBar.css"
import Modal from "react-bootstrap/Modal"
import { useAuth } from "./authContext"

// Include Bootstrap CSS classes (assuming you've included Bootstrap in your project)
import "bootstrap/dist/css/bootstrap.min.css"
import LoginModal from "./loginModal"

type NavbarProps = {
    toggleSideMenu: () => void
}

const NavBar = (props: NavbarProps) => {
    // search stuff
    const [searchInput, setSearchInput] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])

    const [showModal, setShowModal] = useState(false)
    const openModal = () => {
        setShowModal(true)
    }
    const { logout, authenticatedUser, selectedSchool } = useAuth()
    console.log(authenticatedUser)

    // Function to handle search input change
    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.target.value
        setSearchInput(input)

        // BYT DETTA TILL NÅGON VERKLIGT
        const mockSuggestions = [
            "Course 1",
            "Course 2",
            "Course 3",
            "User 1",
            "User 2"
        ]

        // Filter suggestions based on the input
        const filteredSuggestions = mockSuggestions.filter((item) =>
            item.toLowerCase().includes(input.toLowerCase())
        )

        setSuggestions(filteredSuggestions)
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
                Scopus
            </Link>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    {menuItems.map(({ title, pageURL }) => (
                        <li className="nav-item" key={title}>
                            <Link to={pageURL} className="nav-link">
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="search-bar px-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={
                            selectedSchool?.schoolName
                                ? `Search within ${selectedSchool.schoolName}...`
                                : "Search..."
                        }
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                    <div className="suggestions">
                        <ul>
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                </div>

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
                    <div>
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
