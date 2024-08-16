import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faGauge, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2'
function Project() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-CA');
    const [formData, setformData] = useState({
        name: '',
        client: '',
        from: formattedDate,
        to: formattedDate,
        type: "new"
    })
    const [category, setcategory] = useState('');
    const [fromDate, setfromDate] = useState(formattedDate);
    const [toDate, settoDate] = useState(formattedDate);
    const [newProjects, setNewProjects] = useState([]);
    const [workingProjects, setWorkingProjects] = useState([]);
    const [completeProjects, setCompleteProjects] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [selectedProject, setSelectedProject] = useState({
        id: '',
        name: '',
        client: '',
        from: '',
        to: '',
        type: ''
    });
    async function update(event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/AllProject', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedProject })
            });
            const data = await response.json();
            if (response.ok) {
                fetchNewData();
                fetchWorkingData();
                fetchCompleteData();
                swal.fire({ title: data.message, icon: "success", showConfirmButton: false, timer: 1500 });
            } else {
                swal.fire({ title: data.message, icon: "warning", showConfirmButton: false, timer: 1500 });
            }
            setSelectedProject({
                id: '',
                name: '',
                client: '',
                from: '',
                to: '',
                type: ''
            })
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('An error occurred. Please try again.');
        }
    }
    const toggleCollapse = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    async function fetchWorkingData() {
        try {
            const response = await fetch('http://localhost:3000/WorkingProject');
            const data = await response.json();

            setWorkingProjects(data.projects);

        } catch (err) {
            console.error('Failed to fetch new projects:', err);
        }
    }

    async function fetchNewData() {
        try {
            const response = await fetch('http://localhost:3000/NewProject');
            const data = await response.json();

            setNewProjects(data.projects);

        } catch (err) {
            console.error('Failed to fetch new projects:', err);
        }
    }
    async function fetchCompleteData() {
        try {
            const response = await fetch('http://localhost:3000/CompleteProject');
            const data = await response.json();

            setCompleteProjects(data.projects);

        } catch (err) {
            console.error('Failed to fetch new projects:', err);
        }
    }
    useEffect(() => {
        fetchNewData();
        fetchWorkingData();
        fetchCompleteData();
    }, []);
    async function Enterbutton(event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/NewProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                fetchNewData();
                swal.fire({ title: data.message, icon: "success", showConfirmButton: false, timer: 1500 });
            } else {
                swal.fire({ title: data.message, icon: "warning", showConfirmButton: false, timer: 1500 });
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('An error occurred. Please try again.');
        }
        setformData({
            name: '',
            client: '',
            from: formattedDate,
            to: formattedDate,
            type: "new"
        })
    }
    async function deleteNewProject(event, id) {
        event?.preventDefault();
        console.log(id);
        try {
            const response = await fetch('http://localhost:3000/NewProject', {
                method: 'Delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            if (response.ok) {
                fetchNewData();
                swal.fire({ title: data.message, icon: "success", showConfirmButton: false, timer: 1500 })
            }
            setSelectedProject({
                id: '',
                name: '',
                client: '',
                from: '',
                to: '',
                type: ''
            })
        } catch (err) {

        }
    }
    function handleChange(event) {
        const { name, value } = event.target;
        setformData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    async function search(event) {
        event.preventDefault();
        if (category !== '' || toDate !== '' || fromDate !== '') {
            try {
                const response = await fetch('http://localhost:3000/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ category, fromDate, toDate })
                });
                const data = await response.json();
                if (response.ok) {
                    if (category === 'new') {
                        setNewProjects(data.data);
                    } else if (category === 'working') {
                        setWorkingProjects(data.data);
                    } else if (category === 'complete') {
                        setCompleteProjects(data.data);
                    } else {

                        setNewProjects(data.data.filter(proj => proj.Type === 'new'));
                        setWorkingProjects(data.data.filter(proj => proj.Type === 'working'));
                        setCompleteProjects(data.data.filter(proj => proj.Type === 'complete'));
                    }
                    setcategory('')
                    setfromDate('');
                    settoDate('');

                }
            } catch (err) {
                console.error(err);
            }
        }
        else {
            fetchNewData();
            fetchWorkingData();
            fetchCompleteData();
        }
    }
    function handleupdate(event) {
        const { name, value } = event.target;
        setSelectedProject((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
        if (name === "from") {
            selectedProject.to = value;
        }
    }
    return (

        <>
            <div className=" p-0 py-3 " >
                <div className="container">
                    <div className="heading d-flex justify-content-center ">
                        <u className="text-primary fs-1 fw-bold "><FontAwesomeIcon className='fs-1 me-2 ' icon={faGauge} />My DashBoard</u>
                    </div>
                    <form action="" onSubmit={search}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label" htmlhtmlFor="project-category">Project Category</label>
                                <select
                                    className="form-select"
                                    name="project-category"
                                    id="project-category"
                                    value={category}
                                    onChange={(event) => {
                                        setcategory(event.target.value);

                                    }}
                                >
                                    <option value="" disabled hidden>Select Category</option>
                                    <option value="new">New Projects</option>
                                    <option value="working">Working Projects</option>
                                    <option value="complete">Completed Projects</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlhtmlFor="from-date" className="form-label">From</label>
                                <input type="date" className="form-control" id="from-date" value={fromDate} onChange={(event) => { setfromDate(event.target.value) }} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlhtmlFor="to-date" className="form-label">To</label>
                                <input type="date" className="form-control" id="to-date" value={toDate} onChange={(event) => { settoDate(event.target.value); }} />
                            </div>
                            <div className="col-md-1 col-xs-12 position-relative d-xs-flex ">
                                <button type='submit' className="btn btn-danger position-absolute searchbutton"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                            </div>
                        </div>

                    </form>

                    <div className="row my-2 cards-container">
                        <div className="col-md-4">
                            <div className="card h-100 shadow">
                                <div className="card-header d-flex justify-content-center align-items-center bg-primary text-light position-relative fw-bold fs-5">New Projects {newProjects.length}</div>

                                <ul className="list-group list-group-flush" style={{ overflowY: "auto", height: "300px" }}>
                                    {newProjects.map((project) =>
                                        <div key={project._id}>
                                            <li
                                                className="list-group-item newproject d-flex justify-content-between align-items-center "
                                                data-bs-toggle="collapse"
                                                onClick={() => toggleCollapse(project._id)}
                                                data-bs-target={`#${project._id}`}
                                                style={{ fontSize: "15px" }}
                                            >
                                                <p className='m-0 empName'>  {project.name}</p>
                                            </li>
                                            <div id={project._id} className="collapse ">
                                                <p className='p-3 pb-0 m-0 fw-bold'> Details</p>
                                                <ul >
                                                    <li>{project.Client}</li>
                                                    <li>{project.FromDate.split('T')[0]}</li>
                                                    <li>{project.ToDate.split('T')[0]}</li>
                                                </ul>

                                                <div className='card-footer d-flex justify-content-center'>
                                                    <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#view"
                                                        onClick={() => {
                                                            setSelectedProject(
                                                                {
                                                                    id: project._id,
                                                                    name: project.name,
                                                                    client: project.Client,
                                                                    from: project.FromDate.split('T')[0],
                                                                    to: project.ToDate.split('T')[0],
                                                                    type: project.Type
                                                                }
                                                            )
                                                        }}>
                                                        <FontAwesomeIcon className=' me-1 mt-1 ' icon={faEye} />
                                                        View</button>

                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </ul>

                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow">
                                <div className="card-header justify-content-center d-flex bg-danger text-light fw-bold fs-5">Working Projects {workingProjects.length}</div>
                                <ul className="list-group list-group-flush" style={{ overflowY: "auto", height: "300px" }}>
                                    {workingProjects.map((project) => (
                                        <div key={project._id}>
                                            <li
                                                className="list-group-item workingproject d-flex justify-content-between align-items-center"
                                                data-bs-toggle="collapse"
                                                onClick={() => toggleCollapse(project._id)}
                                                data-bs-target={`#${project._id}`}
                                                style={{ fontSize: "15px" }}
                                            >
                                                <p className='m-0 empName'>  {project.name}</p>
                                            </li>
                                            <div id={project._id} className="collapse">
                                                <p className='p-3 pb-0 m-0 fw-bold'> Details</p>
                                                <ul >
                                                    <li>{project.Client}</li>
                                                    <li>{project.FromDate.split('T')[0]}</li>
                                                    <li>{project.ToDate.split('T')[0]}</li>
                                                </ul>
                                                <div className="card-footer d-flex justify-content-center">

                                                    <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#view"
                                                        onClick={() => {
                                                            setSelectedProject(
                                                                {
                                                                    id: project._id,
                                                                    name: project.name,
                                                                    client: project.Client,
                                                                    from: project.FromDate.split('T')[0],
                                                                    to: project.ToDate.split('T')[0],
                                                                    type: project.Type
                                                                }
                                                            )
                                                        }}>
                                                        <FontAwesomeIcon className=' me-1 mt-1 ' icon={faEye} />
                                                        View</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow">
                                <div className="card-header justify-content-center d-flex bg-success text-light fw-bold fs-5">Completed Projects {completeProjects.length}</div>
                                <ul className="list-group list-group-flush" style={{ overflowY: "auto", height: "300px" }}>
                                    {completeProjects.map((project) => (
                                        <div key={project._id}>
                                            <li
                                                className="list-group-item completeproject d-flex justify-content-between align-items-center"
                                                data-bs-toggle="collapse"
                                                onClick={() => toggleCollapse(project._id)}
                                                data-bs-target={`#${project._id}`}
                                                style={{ fontSize: "15px" }}
                                            >
                                                <p className='m-0 empName'>  {project.name}</p>
                                            </li>
                                            <div id={project._id} className="collapse">
                                                <p className='p-3 pb-0 m-0 fw-bold'> Details</p>
                                                <ul >
                                                    <li>{project.Client}</li>
                                                    <li>{project.FromDate.split('T')[0]}</li>
                                                    <li>{project.ToDate.split('T')[0]}</li>
                                                </ul>
                                                <div className="card-footer d-flex justify-content-center">
                                                    <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#view"
                                                        onClick={() => {
                                                            setSelectedProject(
                                                                {
                                                                    id: project._id,
                                                                    name: project.name,
                                                                    client: project.Client,
                                                                    from: project.FromDate.split('T')[0],
                                                                    to: project.ToDate.split('T')[0],
                                                                    type: project.Type
                                                                }
                                                            )
                                                        }}>
                                                        <FontAwesomeIcon className=' me-1 mt-1 ' icon={faEye} />
                                                        View</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-success addbutton" data-bs-toggle="modal" data-bs-target="#exampleModal" >Add New Project</button>
                </div>
            </div>
            {/* modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Project Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlhtmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name='name'
                                        value={formData.name}
                                        placeholder="Enter Title"
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlhtmlFor="client" className="form-label">Client</label>
                                    <input
                                        type="text"
                                        id="client"
                                        name='client'
                                        value={formData.client}
                                        placeholder="Enter Client Name"
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlhtmlFor="from-date" className="form-label">From</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="from-date"
                                        name='from'
                                        min={formattedDate}
                                        value={formData.from}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlhtmlFor="to-date" className="form-label">To</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="to-date"
                                        name='to'
                                        min={fromDate}
                                        value={formData.to}
                                        onChange={handleChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={Enterbutton} data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="view" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">View Project</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form action="" onSubmit={update}>
                            <div className="modal-body">

                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingName" name='name' placeholder="name@example.com" value={selectedProject.name} onChange={handleupdate} />
                                    <label htmlFor="floatingName">Project Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingClient" name='client' placeholder="Password" value={selectedProject.client} onChange={handleupdate} />
                                    <label htmlFor="floatingClient">Client</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="date" className="form-control" id="floatingFrom" name='from' placeholder="Password" value={selectedProject.from} onChange={handleupdate} />
                                    <label htmlFor="floatingFrom">From</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="date" className="form-control" id="floatingTo" name='to' placeholder="Password" value={selectedProject.to} onChange={handleupdate} />
                                    <label htmlFor="floatingTo">To</label>
                                </div>
                                <div className="form-floating">
                                    <select name="type" id="floatingSelect" value={selectedProject.type} className='form-select' onChange={handleupdate}>
                                        <option value="new">New</option>
                                        <option value="working">Working</option>
                                        <option value="complete">Complete</option>
                                    </select>
                                    <label for="floatingSelect">Type</label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button className="btn btn-danger " data-bs-dismiss="modal" onClick={(event) => {
                                    deleteNewProject(event, selectedProject.id)
                                }}>Delete</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Project;