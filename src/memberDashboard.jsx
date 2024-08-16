import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge } from "@fortawesome/free-solid-svg-icons";
function memberDashboard() {

    const [todos, setTodos] = useState([]);
    const [projects, setprojects] = useState([])
    const id = sessionStorage.getItem("id")
    useEffect(() => {
        getprojects();
        getTodos();
    })
    async function getprojects() {
        try {
            const response = await fetch(`http://localhost:3000/getprojects?id=${id}`);
            const data = await response.json();
            if (response.ok) {
                setprojects(data.result);

            }

        } catch (err) {
            console.log(err);
        }

    }
    async function getTodos() {
        try {
            const response = await fetch(`http://localhost:3000/Todo?id=${id}`);
            const data = await response.json();
            if (response.ok) {
                setTodos(data.result);

            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div style={{ backgroundColor: "#f1f1f1" }}>
                <div className="container " >
                    <div className="heading d-flex justify-content-center mt-2">
                        <u className="text-primary fs-1 fw-bold "><FontAwesomeIcon className='fs-1 me-2 ' icon={faGauge} />My DashBoard</u>
                    </div>
                    <div className="row d-flex justify-content-around">
                        <div className="col-md-6 g-5">
                            <div className="card shadow">
                                <div className="card-heading bg-primary text-light d-flex justify-content-center"><h3 className="m-0 my-1">Todo's</h3></div>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Check</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todos.sort((a, b) => b - a).slice(0, 5).map((todo) => (
                                                <tr key={todo._id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={todo.Status === 'Checked'}
                                                            disabled
                                                        /></td>
                                                    <td>{todo.Name}</td>
                                                    <td>{new Date(todo.Date).toLocaleDateString('en-GB')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer d-flex justify-content-center">
                                    <Link to="todo">For More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 g-5">
                            <div className="card shadow">
                                <div className="card-heading bg-primary text-light d-flex justify-content-center"><h3 className="m-0 my-1">Projects</h3></div>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col" className="text-center">Name</th>
                                                <th scope="col" className="text-center">Assigned Date</th>
                                                <th scope="col" className="text-center">Submission Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map((project, index) => (
                                                <tr key={project._id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="text-center">{project.name}</td>
                                                    <td className="text-center">{new Date(project.assignedDate).toLocaleDateString('en-GB')}</td>
                                                    <td className="text-center">{new Date(project.ToDate).toLocaleDateString('en-GB')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer d-flex justify-content-center">
                                    <Link to="project">For More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default memberDashboard;