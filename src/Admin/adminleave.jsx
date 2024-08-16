import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faGauge } from '@fortawesome/free-solid-svg-icons'
function leave() {


    const [selectedLeave, setSelectedLeave] = useState('')
    const [selectedOption, setSelectedOption] = useState('')
    const [leaves, setleaves] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentLeaves, setCurrentLeaves] = useState([]);
    const leavesPerPage = 10
    useEffect(() => {
        getleaves();
    }, [new Date()]);
    async function getleaves() {
        try {
            const response = await fetch('http://localhost:3000/adminPendingleave');
            const data = await response.json();
            if (response.ok) {
                setleaves(data.existingLeave);
            }
        } catch (err) { }
    }


    async function approve(id) {
        const Status = "Approved"
        try {
            const response = await fetch('http://localhost:3000/adminAccRejleave', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, Status })
            });
            if (response.ok) {
                Swal.fire({ title: "Leave Approved", icon: "success", showConfirmButton: false, timer: 1500 })
                getleaves();
            }
            else {
                Swal.fire({ title: "Error Approving Leave", icon: "warning", showConfirmButton: false, timer: 1500 })
            }
        } catch (err) {
            console.log(err);
            Swal.fire({ title: "Server Error", icon: "warning", showConfirmButton: false, timer: 1500 });
        }
    }



    async function reject(id) {
        const Status = "Rejected"
        console.log(selectedOption)
        try {
            const response = await fetch('http://localhost:3000/adminAccRejleave', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, Status })
            });
            if (response.ok) {
                Swal.fire({ title: "Leave Rejected", icon: "success", showConfirmButton: false, timer: 1500 });
                getleaves();
            }
            else {
                Swal.fire({ title: "Error Rejecting Leave", icon: "warning", showConfirmButton: false, timer: 1500 });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({ title: "Server Error", icon: "warning", showConfirmButton: false, timer: 1500 });
        }
    }


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
            <div className="" style={{ height: "", backgroundColor: "#f1f1f1" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-3 d-flex justify-content-left">

                        </div>
                        <div className="col-lg-5 col-md-12 d-flex justify-content-center mt-2 ">
                            <u className="text-primary fs-1 fw-bold text-center ms-3">
                                <FontAwesomeIcon className='fs-1 me-2 ' icon={faGauge} />
                                Leave Request-s
                            </u>
                        </div>
                        <div className="col-lg-4 col-md-12 d-flex justify-content-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/AdminLayout">DashBoard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Leaves
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-between pt-1">
                        <div className="col-md-12 mt-3 pe-4">
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
                                                    {[...currentLeaves].map((leave, index) => (
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

                                                                    <button className="btn btn-info d-flex " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setSelectedLeave(leave) }}><FontAwesomeIcon className=' me-1 mt-1 ' icon={faEye} />View</button>

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
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Leave Request</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="" className="fw-bold">Reason for Leave</label>
                            <textarea className="form-control" name="" id="" value={selectedLeave.Description} cols="55" rows="5" readOnly style={{ resize: "none" }}></textarea>
                            <form action="">
                                <select name="" id="" className="form-select mt-3" value={selectedOption} onChange={(e) => { setSelectedOption(e.target.value) }} disabled={selectedLeave.Status !== "Pending"}>
                                    <option value="">Select</option>
                                    <option value="approve">Approve</option>
                                    <option value="reject">Reject</option>
                                </select>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                onClick={(e) => {
                                    e.preventDefault();
                                    {
                                        if (selectedLeave.Status === "Pending")
                                            if (selectedOption === "approve") {
                                                approve(selectedLeave._id);
                                            }
                                            else if (selectedOption === "reject") {
                                                reject(selectedLeave._id)
                                            }
                                        setSelectedOption('');
                                    }
                                }}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default leave;