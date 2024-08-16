import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLocation } from 'react-router-dom';
function Fullview() {
    const location = useLocation();
    const Status = location.state?.Status;
    const [Pendingleaves, setPendingleaves] = useState([]);
    const [AccRejleaves, setAccRejleaves] = useState([]);
    useEffect(() => {
        getPendingleaves();
        getAccRejleaves();
    }, []);
    async function getPendingleaves() {
        try {
            const response = await fetch('http://localhost:3000/adminPendingleave');
            const data = await response.json();
            if (response.ok) {
                setPendingleaves(data.existingLeave);
            }
        } catch (err) { }
    }
    async function getAccRejleaves() {
        try {
            const response = await fetch('http://localhost:3000/adminAccRejleave');
            const data = await response.json();
            if (response.ok) {
                setAccRejleaves(data.existingLeave);
            }
        } catch (err) {
            console.log(err);
        }
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
                getPendingleaves();
                getAccRejleaves();
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
        console.log(id);
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
                getPendingleaves();
                getAccRejleaves();
            }
            else {
                Swal.fire({ title: "Error Rejecting Leave", icon: "warning", showConfirmButton: false, timer: 1500 });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({ title: "Server Error", icon: "warning", showConfirmButton: false, timer: 1500 });
        }
    }








    return (
        <>
            <div  style={{ backgroundColor: "#f1f1f1" }}>
                <div className="container">

                    <div className="row d-flex justify-content-between pt-5">
                        <div className="col-md-12 mt-3">
                            <div className="row">
                                <div className="card shadow p-0">
                                    <div className="card-heading bg-primary text-light d-flex justify-content-center">{Status === "Pending" ? (<h3 className="m-0 my-1">Pending Leaves</h3>) : (<h3 className="m-0 my-1">Accepted/Rejected Leaves</h3>)}</div>
                                    <div className="card-body">
                                        <div className="table-container" >
                                            <table className="table  table-striped " style={{ borderCollapse: "collapse" }}>
                                                <thead className="">
                                                    <tr className="align-middle ">
                                                        <th scope="col" className="text-center">#</th>
                                                        <th scope="col" className="text-center">Name</th>
                                                        <th scope="col" className="text-center">Description</th>
                                                        <th scope="col" className="text-center">From</th>
                                                        <th scope="col" className="text-center">To</th>
                                                        <th scope="col" className="text-center">Status</th>
                                                        {Status === "Pending" && (
                                                            <th scope="col" className="text-center">Actions</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Status === "Pending" ?
                                                        Pendingleaves.map((leave, index) => (
                                                            <tr key={leave._id}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td className="text-center">
                                                                    {leave.Name}
                                                                </td>
                                                                <td className="text-center">
                                                                    {leave.Description}
                                                                </td>
                                                                <td className="text-center">
                                                                    {new Date(leave.From).toLocaleDateString('en-GB')}
                                                                </td>
                                                                <td className="text-center">
                                                                    {new Date(leave.To).toLocaleDateString('en-GB')}
                                                                </td>
                                                                <td className="text-center">{leave.Status}</td>
                                                                <td>
                                                                    <div className="d-flex justify-content-center">
                                                                        <button className="btn btn-success" onClick={(e) => { e.preventDefault(); approve(leave._id) }}>Approve</button>
                                                                        <button className="btn btn-danger ms-1" onClick={(e) => { e.preventDefault(); reject(leave._id) }}>Reject</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        :
                                                        AccRejleaves.map((leave, index) => (
                                                            <tr key={leave._id}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td className="text-center">
                                                                    {leave.Name}
                                                                </td>
                                                                <td className="text-center">
                                                                    {leave.Description}
                                                                </td>
                                                                <td className="text-center">
                                                                    {new Date(leave.From).toLocaleDateString('en-GB')}
                                                                </td>
                                                                <td className="text-center">
                                                                    {new Date(leave.To).toLocaleDateString('en-GB')}
                                                                </td>
                                                                <td className="text-center">{leave.Status}</td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}
export default Fullview;