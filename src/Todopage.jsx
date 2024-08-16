import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPencil, faXmark, faFileCirclePlus, faBars, faEye } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faCircleDown, faSquarePlus } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
function Todo() {
    const [formdata, setFormData] = useState({
        Name: '',
        Description: '',
        Status: 'unChecked'
    });
    const [Status, setStatus] = useState();
    const [selectedTodo, setSelectedTodo] = useState();
    const [todos, setTodos] = useState([]);
    const user = sessionStorage.getItem("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentTodo, setCurrentTodos] = useState([]);
    const TodoPerPage = 5

    useEffect(() => {
        const total = Math.ceil(todos.length / TodoPerPage);
        setTotalPages(total);
        const lastIndex = currentPage * TodoPerPage;
        const firstIndex = lastIndex - TodoPerPage;
        setCurrentTodos(todos.slice(firstIndex, lastIndex));
    }, [todos, currentPage, TodoPerPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    function handleformChange(e) {
        const { name, value, checked, type } = e.target;

        setFormData((prev) => {
            return {
                ...prev,
                [name]: type === "checkbox" ? (checked ? "Checked" : "Unchecked") : value,
            };
        });
    }

    async function addTodo(event) {
        console.log(formdata.Description)
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/Todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formdata, user })
            });
            if (response.ok) {
                Swal.fire({ title: "Successfully Added", icon: "success", showCancelButton: false, timer: 1500 })
                getTodos();
                setFormData({
                    Name: '',
                    Description: '',
                    Status: 'unChecked'
                });
            }
            else {
                Swal.fire({ title: "Error", icon: "warning", showCancelButton: false, timer: 1500 })
            }
        } catch (err) {
            console.log(err);
            Swal.fire({ title: "Error", icon: "warning", showCancelButton: false, timer: 1500 })
        }
    }
    async function getTodos() {
        try {
            const response = await fetch(`http://localhost:3000/Todo?id=${user}`);
            const data = await response.json();
            if (response.ok) {
                setTodos(data.result);

            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getTodos();
    }, [])

    async function save(event) {
        event.preventDefault();
        console.log(formdata);
        try {
            const response = await fetch(`http://localhost:3000/Todo?id=${selectedTodo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formdata})
            });
            if (response.ok) {
                Swal.fire({ title: "Successfully Updated", icon: "success", showCancelButton: false, timer: 1500 })
                getTodos();
            }
            setSelectedTodo('');
            setFormData({
                Name: '',
                Description: ''
            });
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteTodo(event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/Todo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedTodo._id })
            });
            if (response.ok) {
                Swal.fire({ title: "Successfully Deleted", icon: "success", showCancelButton: false, timer: 1500 })
                getTodos();
            }
            setSelectedTodo('');
            setFormData({
                Name: '',
                Description: ''
            });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div style={{ backgroundColor: "#f1f1f1", height: "90vh" }}>
                <div className="container">
                    <div className="row align-items-center mt-">
                        <div className="col-md-4 d-flex justify-content-left">

                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <u className="text-primary fs-1 fw-bold ">
                                <FontAwesomeIcon className='fs-1 me-2 ' icon={faSquareCheck} />My Todo-s
                            </u>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><Link to="/Layout">DashBoard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Todo</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row mb-2 ">
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Add<FontAwesomeIcon className='ms-2' icon={faBars} /></button>
                        </div>
                    </div>

                    <div className="card shadow">
                        <div className="card-heading bg-primary text-center">
                            <h2 className='text-light fw-bold'>Todos</h2>
                        </div>
                        <div className="card-body">
                            <div className="table-container table-responsive ">
                                <table className="table table-striped ">
                                    <thead>
                                        <tr>
                                            <th scope='col' className='text-'>index</th>
                                            <th scope='col' className='text-center'>Name</th>
                                            <th scope='col' className='text-center' >Date</th>
                                            <th scope='col' className='text-center' >Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTodo.map((todo, index) => (
                                            <tr key={todo._id}>
                                                <th scope='col' className={`${todo.Status === "Checked" ? "text-secondary" : ""}`}>{index + 1}</th>
                                                <td className={`text-center ${todo.Status === "Checked" ? "text-secondary" : ""}`}>
                                                    {todo.Name}
                                                </td>
                                                <td className={`text-center ${todo.Status === "Checked" ? "text-secondary" : ""}`}>
                                                    {new Date(todo.Date).toLocaleDateString('en-GB')}
                                                </td>
                                                <td className='text-center' >
                                                    <button className="btn btn-info" onClick={() => {
                                                        setFormData({
                                                            Name: todo.Name,
                                                            Description: todo.Description,
                                                            Status: todo.Status
                                                        });
                                                        setSelectedTodo(todo._id)
                                                    }} data-bs-toggle="modal" data-bs-target="#view" ><p className={`m-0 p-0 ${todo.Status === "Checked" ? "text-secondary" : ""}`}><FontAwesomeIcon className='me-1' icon={faEye} />View</p></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <nav aria-label="pages">
                            <ul className="pagination d-flex justify-content-center mt-3">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <a className="page-link" href="#" tabIndex="-1" aria-disabled={currentPage === 1} onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}>
                                        Previous
                                    </a>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                                            {i + 1}
                                        </a>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <a className="page-link" href="#" aria-disabled={currentPage === totalPages} onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}>
                                        Next
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Todo</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form action="" onSubmit={addTodo}>
                            <div className="modal-body">

                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingInput" required placeholder="" name='Name' value={formdata.Name} onChange={handleformChange} />
                                    <label htmlFor="floatingInput">Name</label>
                                </div>
                                <div className="form-floating">
                                    <textarea className="form-control" placeholder="Leave a comment here" required id="floatingTextarea" style={{ resize: "none", height: "100px" }} name='Description' value={formdata.Description} onChange={handleformChange}></textarea>
                                    <label htmlFor="floatingTextarea">Description</label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="view" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">View Todo</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {formdata && (
                            <form action="" onSubmit={save}>
                                <div className="modal-body">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingInput"
                                            required
                                            placeholder=""
                                            name="Name"
                                            value={formdata.Name}
                                            onChange={handleformChange}
                                        />
                                        <label htmlFor="floatingInput">Name</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea
                                            className="form-control"
                                            placeholder="Leave a comment here"
                                            required
                                            id="floatingTextarea"
                                            style={{ resize: "none", height: "100px" }}
                                            name="Description"
                                            value={formdata.Description}
                                            onChange={handleformChange}
                                        ></textarea>
                                        <label htmlFor="floatingTextarea">Description</label>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                        <input
                                            type="checkbox"
                                            className="btn-check"
                                            id="btncheck1"
                                            name="Status"
                                            checked={formdata.Status === "Checked"}
                                            onChange={handleformChange}
                                        />
                                        <label className="btn btn-outline-primary" htmlFor="btncheck1">Completed</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteTodo}>
                                        <FontAwesomeIcon className="me-1" icon={faTrashCan} />Delete
                                    </button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                        <FontAwesomeIcon className="me-1" icon={faCircleDown} />Save
                                    </button>
                                </div>
                            </form>

                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Todo;