import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
function Projects() {
    const [projects, setprojects] = useState([]);
    const user = sessionStorage.getItem("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentProjects, setCurrentProjects] = useState([]);
    const ProjectPerPage = 10

    useEffect(() => {
        const total = Math.ceil(projects.length / ProjectPerPage);
        setTotalPages(total);
        const lastIndex = currentPage * ProjectPerPage;
        const firstIndex = lastIndex - ProjectPerPage;
        setCurrentProjects(projects.slice(firstIndex, lastIndex));
    }, [projects, currentPage, ProjectPerPage]);
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    async function getprojects() {
        try {
            const response = await fetch(`http://localhost:3000/getprojects?id=${user}`);
            const data = await response.json();
            if (response.ok) {
                setprojects(data.result);

            }

        } catch (err) {
            console.log(err);
        }

    }
    useEffect(() => {
        getprojects();
    }, [])
    return (
        <>
            <div style={{ backgroundColor: "#f1f1f1", height: "90vh" }}>
                <div className="container">
                    <div className="row align-items-center pt-3 ">
                        <div className="col-md-4 d-flex justify-content-left">

                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <u className="text-primary fs-1 fw-bold ">
                                <FontAwesomeIcon className='fs-1 me-2 ' icon={faProductHunt} />My Project-s
                            </u>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><Link to="/Layout">DashBoard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Projects</li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="card shadow rounded mt-4">
                        <div className="card-heading bg-primary d-flex justify-content-center"><h3 className='text-light fw-bold'>Assigned Projects</h3></div>
                        <div className="card-body">
                            <div className="table-container table-responsive  ">
                                <table className="table table-striped ">
                                    <thead >
                                        <tr className=''>
                                            <th scope='col' >#</th>
                                            <th scope='col' className='text-center'>Name</th>
                                            <th scope='col' className='text-center' >Client</th>
                                            <th scope='col' className='text-center' >From</th>
                                            <th scope='col' className='text-center' >To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProjects.map((project, index) => (
                                            <tr key={project._id}>
                                                <td >{index + 1}</td>
                                                <td className="text-center">{project.name}</td>
                                                <td className="text-center">{project.Client}</td>
                                                <td className="text-center">
                                                    {new Date(project.FromDate).toLocaleDateString('en-GB')}
                                                </td>
                                                <td className="text-center">
                                                    {new Date(project.ToDate).toLocaleDateString('en-GB')}
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
        </>
    );
}

export default Projects;