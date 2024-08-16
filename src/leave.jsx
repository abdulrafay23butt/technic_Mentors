import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

function leave() {

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-CA');
    const user = sessionStorage.getItem("id")
    const [selectedLeave, setSelectedLeave] = useState('')
    const [formData, setformData] = useState({
        id: user,
        Name: '',
        Description: '',
        From: formattedDate,
        To: formattedDate,
        Status: 'Pending'
    })
    const [leaves, setleaves] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentLeaves, setCurrentLeaves] = useState([]);
    const [fromdate, setfromdate] = useState('');
    const [todate, settodate] = useState('');
    const [leavesPerPage, setLeavesPerPage] = useState(10);
    useEffect(() => {
        getleaves();
    }, []);
    async function getleaves() {
        try {
            const response = await fetch(`http://localhost:3000/leave?id=${user}`);
            const data = await response.json();
            if (response.ok) {
                setleaves(data.existingLeave);
            }
        } catch (err) { }
    }

    async function submitform(event) {
        console.log(user);
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                Swal.fire({ title: "Leave Submitted", icon: "success", showConfirmButton: false, timer: 1500 })
                getleaves();
            }
            else {
                Swal.fire({ title: "Leave Already Exists", icon: "warning", showConfirmButton: false, timer: 1500 })
            }
            const modalElement = document.getElementById('exampleModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            setformData({
                id: user,
                Name: '',
                Description: '',
                From: formattedDate,
                To: formattedDate,
                Status: 'Pending'
            })
        } catch (err) {
            Swal.fire({ title: "Server Error", icon: "success", showConfirmButton: false, timer: 1500 });
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setformData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        })
    }

    async function deleteLeave(id) {
        console.log(id);
        try {
            const response = await fetch('http://localhost:3000/leave', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            if (response.ok) {
                Swal.fire({ title: "Leave Deleted", icon: "success", showConfirmButton: false, timer: 1500 });
                getleaves();
            }
            else {
                Swal.fire({ title: "Error Deleting Leave", icon: "warning", showConfirmButton: false, timer: 1500 });
            }
        } catch (err) {
            Swal.fire({ title: "Server Error", icon: "warning", showConfirmButton: false, timer: 1500 });
        }
    }

    async function handleSaveClick(leave) {
        try {
            const response = await fetch('http://localhost:3000/leave', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leave)
            });
            if (response.ok) {
                Swal.fire({ title: "Leave Updated", icon: "success", showConfirmButton: false, timer: 1500 });
                getleaves();
            }
            else {
                Swal.fire({ title: "Error Updating Leave", icon: "warning", showConfirmButton: false, timer: 1500 });
            }
        } catch (err) {
            Swal.fire({ title: "Server Error", icon: "warning", showConfirmButton: false, timer: 1500 });
        }

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name);
        const updatedLeave = { ...selectedLeave, [name]: value };
        if (name === 'From' && new Date(updatedLeave.To) < new Date(value)) {
            updatedLeave.To = value;
        }
        setSelectedLeave(updatedLeave);
    };


    useEffect(() => {
        const total = Math.ceil(leaves.length / leavesPerPage);
        setTotalPages(total);
        const lastIndex = currentPage * leavesPerPage;
        const firstIndex = lastIndex - leavesPerPage;
        setCurrentLeaves(leaves.slice(firstIndex, lastIndex));
    }, [leaves, currentPage, leavesPerPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (
        <>
            <div className="" style={{ backgroundColor: "#f1f1f1" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex justify-content-left">
                            
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <u className="text-primary fs-1 fw-bold ">
                                <FontAwesomeIcon className='fs-1 me-2' icon={faCalendar} />
                                My Leave-s
                            </u>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/Layout">DashBoard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Leaves
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>


                    <div className="row d-flex justify-content-between">
                        <div className="col-md-6 col-6 d-flex justify-content-left align-items-center">
                            <p className=" m-0">
                                Show
                                <select
                                    name=""
                                    id=""
                                    className="ms-1"
                                    value={leavesPerPage}
                                    onChange={(e) => {
                                        setLeavesPerPage(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </p>
                        </div>
                        <div className="col-md-6 col-6 d-flex justify-content-end mb-2">
                            <button
                                className="btn btn-success"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="card shadow p-0">
                            <div className="card-heading bg-primary text-light d-flex justify-content-center"><h3 className="m-0 my-1">Leaves</h3></div>
                            <div className="card-body">
                                <div className="table-container" >
                                    <table className="table  table-striped " style={{ borderCollapse: "collapse" }}>
                                        <thead className="">
                                            <tr className="align-middle ">
                                                <th scope="col" className="text-center">#</th>
                                                <th scope="col" className="text-center">Name</th>
                                                <th scope="col" className="text-center">From</th>
                                                <th scope="col" className="text-center">To</th>
                                                <th scope="col" className="text-center">Status</th>
                                                <th scope="col" className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentLeaves.map((leave, index) => (
                                                <tr key={leave._id}>
                                                    <th scope="row" className="text-center">{(currentPage - 1) * leavesPerPage + index + 1}</th>
                                                    <td className="text-center">
                                                        {leave.Name}
                                                    </td>
                                                    <td className="text-center">
                                                        {new Date(leave.From).toLocaleDateString('en-GB')}
                                                    </td>
                                                    <td className="text-center">
                                                        {new Date(leave.To).toLocaleDateString('en-GB')}
                                                    </td>
                                                    <td className="text-center" style={{ width: "10%" }}>
                                                        <p className={`m-0 p-0 rounded text-light ${leave.Status === "Approved" ? "bg-success" : leave.Status === "Rejected" ? "bg-danger" : "bg-warning"}`}>
                                                            {leave.Status}
                                                        </p>
                                                    </td>
                                                    <td >
                                                        <div className="d-flex justify-content-center">

                                                            <button
                                                                className="btn btn-info d-flex ms-1"
                                                                onClick={(e) => { e.preventDefault(); setSelectedLeave(leave) }}
                                                                disabled={leave.Status !== "Pending"}
                                                                data-bs-toggle="modal" data-bs-target="#view"
                                                            >
                                                                <FontAwesomeIcon className=' me-1 mt-1 ' icon={faEye} />
                                                                View
                                                            </button>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <nav aria-label="pages">
                            <ul className="pagination d-flex justify-content-center mt-5">
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
                            <h5 className="modal-title" id="exampleModalLabel">Leave Form</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form className="needs-validation" onSubmit={submitform}>
                            <div className="modal-body">

                                <div className="form-floating mb-3 shadow-sm rounded" >
                                    <input type="text" className="form-control " id="floatingInput" name="Name" placeholder="name@example.com" required value={formData.Name} onChange={handleChange} />
                                    <label htmlFor="floatingInput">Name</label>
                                </div>
                                <div className="form-floating mb-3 shadow-sm rounded" >
                                    <input type="text" className="form-control " id="floatingInput" name="Description" placeholder="name@example.com" required value={formData.Description} onChange={handleChange} />
                                    <label htmlFor="floatingInput">Description</label>
                                </div>
                                <div className="form-floating mb-3 shadow-sm rounded" >
                                    <input type="date" className="form-control " id="floatingInput" name="From" placeholder="" min={formattedDate} required value={formData.From} onChange={handleChange} />
                                    <label htmlFor="floatingInput">From</label>
                                </div>
                                <div className="form-floating mb-3 shadow-sm rounded" >
                                    <input type="date" className="form-control " id="floatingInput" name="To" placeholder="" min={formData.From} required value={formData.To} onChange={handleChange} />
                                    <label htmlFor="floatingInput">To</label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" >Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="view" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Leave Form</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form className="needs-validation">
                            <div className="modal-body">
                                <div className="form-floating mb-3 shadow-sm rounded">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingInput"
                                        name="Name"
                                        required
                                        value={selectedLeave.Name}
                                        onChange={(e) => handleInputChange(e, selectedLeave._id)}
                                    />
                                    <label htmlFor="floatingInput">Name</label>
                                </div>
                                <div className="form-floating mb-3 shadow-sm rounded">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingInput"
                                        name="Description"
                                        required
                                        value={selectedLeave.Description}
                                        onChange={(e) => handleInputChange(e, selectedLeave._id)}
                                    />
                                    <label htmlFor="floatingInput">Description</label>
                                </div>
                                <div className="form-floating mb-3 shadow-sm rounded">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="floatingInput"
                                        name="From"
                                        min={formattedDate}
                                        required
                                        value={selectedLeave.From ? new Date(selectedLeave.From).toLocaleDateString('en-CA') : ''}
                                        onChange={(e) => handleInputChange(e, selectedLeave._id)}
                                    />
                                    <label htmlFor="floatingInput">From</label>
                                </div>
                                <div className="form-floating mb-3 shadow-sm rounded">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="floatingInput"
                                        name="To"
                                        min={selectedLeave.From}
                                        required
                                        value={selectedLeave.To ? new Date(selectedLeave.To).toLocaleDateString('en-CA') : ''}
                                        onChange={(e) => handleInputChange(e, selectedLeave._id)}
                                    />
                                    <label htmlFor="floatingInput">To</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteLeave(selectedLeave._id);
                                    }}>
                                    Delete Leave
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSaveClick(selectedLeave);
                                    }}>
                                    Save changes
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}
export default leave;