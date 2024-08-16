import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
function AdminProject() {
    const [selectedUsers, setSelectedUsers] = useState({});
    const [combinedResult, setCombinedResult] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentProjects, setCurrentProjects] = useState([]);
    const ProjectPerPage = 10

    useEffect(() => {
        const total = Math.ceil(combinedResult.length / ProjectPerPage);
        setTotalPages(total);
        const lastIndex = currentPage * ProjectPerPage;
        const firstIndex = lastIndex - ProjectPerPage;
        setCurrentProjects(combinedResult.slice(firstIndex, lastIndex));
    }, [combinedResult, currentPage, ProjectPerPage]);
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    async function fetchWorkingData() {
        try {
            const response = await fetch('http://localhost:3000/WorkingProject');
            const data = await response.json();
            if (response.ok) {
                setCombinedResult(data.combinedData)
            }

        } catch (err) {
            console.error('Failed to fetch new projects:', err);
        }
    }
    const resetCheckedUsers = () => {
        setSelectedUsers({});
    };
    useEffect(() => {
        fetchWorkingData();
        const modalElement = document.getElementById('exampleModal'); // Replace with your actual modal ID

        const handleModalDismiss = () => {
            resetCheckedUsers();
        };

        modalElement.addEventListener('hidden.bs.modal', handleModalDismiss);

        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalDismiss);
        };
    }, []);


    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    async function handleSaveClick(data) {
        try {
            const response = await fetch('http://localhost:3000/UserProject', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data, selectedUsers })
            });
            if (response.ok) {
                Swal.fire({ title: "Leave Updated", icon: "success", showConfirmButton: false, timer: 1500 });
                fetchWorkingData();
            }
            else {
                Swal.fire({ title: "Error Updating Leave", icon: "warning", showConfirmButton: false, timer: 1500 });
            }
        } catch (err) {
            Swal.fire({ title: "Server Error", icon: "warning", showConfirmButton: false, timer: 1500 });
        }

    };


    return (
        <>

            <div className="" style={{ backgroundColor: "#f1f1f1" }}>
                <div className="container mt-3">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex justify-content-left">

                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <u className="text-primary fs-1 fw-bold ">
                                <FontAwesomeIcon className='fs-1 me-2 ' icon={faProductHunt} />
                                My Project-s
                            </u>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/AdminLayout">DashBoard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Project
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="card shadow p-0">
                            <div className="card-heading bg-primary text-light d-flex justify-content-center"><h3 className="m-0 my-1">Projects</h3></div>
                            <div className="card-body">
                                <div className="table-container" >
                                    <table className="table  table-striped " style={{ borderCollapse: "collapse" }}>
                                        <thead className="">
                                            <tr className="align-middle  ">
                                                <th scope="col" className="text-center">#</th>
                                                <th scope="col" className="text-center">Name</th>
                                                <th scope="col" className="text-center">Client</th>
                                                <th scope="col" className="text-center">From</th>
                                                <th scope="col" className="text-center">To</th>
                                                <th scope="col" className="text-center">Developer</th>
                                                <th scope="col" className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProjects.map((data, index) => (
                                                <tr key={data.projects._id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="text-center">{data.projects.name}</td>
                                                    <td className="text-center">{data.projects.Client}</td>
                                                    <td className="text-center">{new Date(data.projects.FromDate).toLocaleDateString('en-GB')}</td>
                                                    <td className="text-center">{new Date(data.projects.ToDate).toLocaleDateString('en-GB')}</td>
                                                    <td className="text-center">
                                                        {data.user.map((u) => (
                                                            <ul key={u._id} className="list-group list-unstyled">
                                                                <li >{u.Name}</li>
                                                            </ul>
                                                        ))}
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-info" onClick={() => { setSelectedProject(data) }} data-bs-toggle="modal" data-bs-target="#exampleModal" ><FontAwesomeIcon className=' me-2 ' icon={faEye} />View</button>
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
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {selectedProject && (
                            <div className="modal-body">
                                <div className="p-3 bg-light">
                                    <h5 className="mb-1">Project: <strong>{selectedProject.projects.name}</strong></h5>
                                    <p className="mb-1">Client: <strong>{selectedProject.projects.Client}</strong></p>
                                    <p className="mb-1"> Duration: <strong>{new Date(selectedProject.projects.FromDate).toLocaleDateString('en-GB')} - {new Date(selectedProject.projects.ToDate).toLocaleDateString('en-GB')}</strong></p>
                                    <div>
                                        <p>Developers</p>
                                        {selectedProject.user.map((u) => (
                                            <div className="btn-group" style={{ width: "30%" }} role="group" aria-label="Basic checkbox toggle button group" key={u._id}>
                                                <input
                                                    type="checkbox"
                                                    className="btn-check"
                                                    checked={selectedUsers[u._id] || false}
                                                    id={u._id}
                                                    onChange={() => handleCheckboxChange(u._id)}
                                                />
                                                <label className="btn btn-outline-danger text-truncate" htmlFor={u._id}>{u.Name}</label>
                                            </div>
                                        ))}
                                        <caption style={{ width: "300px" }}><small>Check the button to <b>UnAssign</b> developer</small></caption>

                                    </div>
                                </div>

                            </div>
                        )}

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => {
                                e.preventDefault();
                                handleSaveClick(selectedProject.projects._id);
                            }}>UnAssign Developer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminProject;