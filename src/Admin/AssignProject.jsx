import { useState, useEffect } from 'react';
import swal from 'sweetalert2'
import "./AssignProject.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faUser, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
function AssignProject() {
    const [showModal, setShowModal] = useState(false);
    const [choice, setChoice] = useState('individual');
    const [selectedOptions, setSelectedOptions] = useState({
        select1: '',
        select2: '',
        select3: '',
        select4: '',
    });
    const [individualEmp, setindividualEmp] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [SelectedTeamProject, setSelectedTeamProject] = useState(null);
    const [validEmp, setvalidEmp] = useState(true);
    const [IndividualValidProject, setIndividualValidProject] = useState(true);
    const [userproject, setuserproject] = useState([]);
    const [teamproject, setTeamproject] = useState([]);
    const [validEmp1, setValidEmp1] = useState(true);
    const [validEmp2, setValidEmp2] = useState(true);
    const [ValidTeamProject, setValidTeamProject] = useState(true);
    useEffect(() => {
        getusers();
    }, []);
    useEffect(() => {
        fetchUserProject()
    }, [individualEmp, employees]);


    useEffect(() => {
        if (selectedOptions.select1 !== '')
            fetchTeamProject()
    }, [selectedOptions]);
    async function getusers() {
        try {
            const response = await fetch('http://localhost:3000/users');
            const data = await response.json();
            setEmployees(data);

        } catch (err) { }
    }
    async function fetchTeamProject() {
        try {
            const id1 = selectedOptions.select1 || null;
            const id2 = selectedOptions.select2 || null;
            const id3 = selectedOptions.select3 || null;
            const id4 = selectedOptions.select4 || null;
            const response = await fetch(`http://localhost:3000/TeamProject?id1=${id1}&id2=${id2}&id3=${id3}&id4=${id4}`);
            const data = await response.json();
            if (response.ok) {
                setTeamproject(data.relatedProjects);
            }
        } catch (err) {
            console.error('Failed to fetch new projects:', err);
        }
    }
    async function fetchUserProject() {
        try {
            const id = individualEmp._id || null;
            const response = await fetch(`http://localhost:3000/UserProject?id=${id}`);
            const data = await response.json();
            if (response.ok)
                setuserproject(data.relatedProjects);
        } catch (err) {
            console.error('Failed to fetch new projects:', err);
        }
    }
    const handleSelectChange = (event, selectName) => {
        const newValue = event.target.value;
        setSelectedOptions(prev => ({
            ...prev,
            [selectName]: newValue,
        }));
    };

    const getDisabledOptionsForSelect = () => {
        return employees.map(option => {
            const isDisabled = [
                selectedOptions.select1,
                selectedOptions.select2,
                selectedOptions.select3,
                selectedOptions.select4,
            ].includes(option._id.toString());

            return {
                ...option,
                disabled: isDisabled,
            };
        });
    };
    async function submit() {
        setShowModal(false);
        if (choice === "individual") {
            try {
                const response = await fetch('http://localhost:3000/UserProject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        individualEmpId: individualEmp._id,
                        selectedProject: selectedProject._id
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    swal.fire({ title: data.message, icon: "success" })
                    getusers();
                }
                setIndividualValidProject(true);
                setvalidEmp(true);
            } catch (err) { }
            setindividualEmp(null);
            setSelectedProject(null);

        }
        else {
            try {
                const response = await fetch('http://localhost:3000/TeamProject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        selectedOptions,
                        selectedProject: SelectedTeamProject._id
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    swal.fire({ title: data.message, icon: "success" })
                    getusers();
                }
            } catch (err) { }
            setSelectedOptions({
                select1: '',
                select2: '',
                select3: '',
                select4: '',
            });
            setTeamproject([])
        }
    }
    function savebutton(event) {
        event.preventDefault();
        let chk = true;
        if (choice === "individual") {
            if (!individualEmp || !selectedProject) {
                if (!individualEmp) {
                    setvalidEmp(false);
                    chk = false;
                }
                else {
                    setvalidEmp(true);
                    chk = true;
                }
                if (!selectedProject) {
                    setIndividualValidProject(false);
                    chk = false;
                }
                else {
                    setIndividualValidProject(true);
                    chk = true;
                }
            }
        }
        else {
            if (selectedOptions.select1 === '' || selectedOptions.select2 === '') {
                if (selectedOptions.select1 === '') {
                    setValidEmp1(false);
                    chk = false;
                }
                else {
                    setValidEmp1(true);
                    chk = true;
                }
                if (selectedOptions.select2 === '') {
                    setValidEmp2(false);
                    chk = false;
                }
                else {
                    setValidEmp2(true);
                    chk = true;
                }
                if (!selectedProject) {
                    setValidTeamProject(false);
                    chk = false;
                }
                else {
                    setValidTeamProject(true);
                    chk = true;
                }
            }
        }
        if (chk)
            setShowModal(true);
    }

    return (

        <>

            <div className=' p-0 py-3 card-container ' >
                <div className="container ">
                    <div className="row align-items-center">
                        <div className="col-lg-3 ">

                        </div>
                        <div className="col-lg-5 col-md-12 d-flex justify-content-center ">
                            <u className="text-primary fs-1 fw-bold ">
                                <FontAwesomeIcon className='fs-1 me-2' icon={faProductHunt} />
                                Assign Projects
                            </u>
                        </div>
                        <div className="col-lg-4 col-md-12 d-flex justify-content-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/AdminLayout">DashBoard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Assign Projects
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row my-4 cards-container ">
                        <div className="col-md-4">
                            <div className="card h-100 shadow">
                                <div className="card-header d-flex justify-content-center align-items-center bg-success text-light position-relative fw-bold fs-5">Employees {employees.length}</div>

                                <ul className="list-group list-group-flush" style={{ overflowY: "auto", height: "300px" }}>
                                    {employees.map((employee) =>
                                        <div key={employee._id}>
                                            <li
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#${employee._id}`}
                                                style={{ fontSize: "15px" }}
                                            >
                                                <div className='m-0 empName d-flex justify-content-between fs-5'> <FontAwesomeIcon className=' me-1 mt-1 ' icon={faCircleUser} /> {employee.Name}</div>
                                            </li>
                                            <div id={employee._id} className="collapse">
                                                <p className='p-3 pb-0 m-0 fw-bold'> Details</p>
                                                <ul className='mx-1 p-0' >
                                                    <li className=' ' >
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary dropdown-toggle "
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <FontAwesomeIcon className='fs-5 me-1 ' icon={faPeopleGroup} />    Individual Projects: {employee.individual_projects.length}
                                                        </button>
                                                        <ul className="dropdown-menu ">
                                                            {employee.individual_projects.map((individual, index) => (
                                                                <li key={index} className="list-group-item">
                                                                    {individual}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        <button
                                                            type="button"
                                                            className="btn btn-success dropdown-toggle "
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <FontAwesomeIcon className='fs-5 me-1 ' icon={faUser} /> Team Projects: {employee.team_Projects.length}
                                                        </button>
                                                        <ul className="dropdown-menu ">
                                                            {employee.team_Projects.map((team, index) => (
                                                                <li key={index} className="">
                                                                    {team}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>

                                            </div>
                                        </div>
                                    )}

                                </ul>

                            </div>
                        </div>
                        <div className="col-md-8">
                            <form action="">
                                <div className="radiobuttons d-flex justify-content-around">
                                    <div className="individual">
                                        <label htmlFor="" className="form-label fw-bold me-1">individual</label>
                                        <input
                                            type="radio"
                                            name="projectType"
                                            id="individual"
                                            value="individual"
                                            className="form-check-input"
                                            checked={choice === 'individual'}
                                            onChange={() => setChoice('individual')}
                                        />
                                    </div>
                                    <div className="team">
                                        <label htmlFor="" className="form-label  fw-bold me-1" id="team">Team</label>
                                        <input
                                            type="radio"
                                            name="projectType"
                                            id="team"
                                            value="team"
                                            className="form-check-input"
                                            checked={choice === 'team'}
                                            onChange={() => setChoice('team')}
                                        />
                                    </div>
                                </div>
                            </form>
                            <div className="row d-flex justify-content-between ">
                                <div className="col-md-5 " >
                                    <form onSubmit={savebutton} >
                                        <div>
                                            <div className="employees col-md-12">
                                                <label htmlFor="employeeDropdown" className={`form-label fw-bold ${choice === "team" ? 'text-secondary' : 'text-dark'}`}>Select Employee</label>
                                                <button
                                                    style={{ backgroundColor: "white" }}
                                                    className="btn dropdown-toggle dropdown-button"
                                                    type="button"
                                                    id="employeeDropdown"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                    aria-required="true"
                                                    aria-describedby="employeeFeedback"
                                                    disabled={choice === 'team'}
                                                >
                                                    {individualEmp ? individualEmp.Name : "Employees"}

                                                </button>
                                                {validEmp === false && (
                                                    <div >
                                                        <p className='text-danger'>Please Choose an Employee</p>
                                                    </div>
                                                )}
                                                <ul className="dropdown-menu " aria-labelledby="employeeDropdown">
                                                    {employees.map((employee) => (
                                                        <li key={employee._id}>
                                                            <a
                                                                role="button"
                                                                className="dropdown-item"
                                                                onClick={() => {
                                                                    setindividualEmp(employee);
                                                                }}
                                                            >
                                                                {employee.Name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="projects my-3 col-md-12">
                                                <label htmlFor="projectDropdown" className={`form-label fw-bold ${choice === "team" ? 'text-secondary' : 'text-dark'}`}>Select Project</label>
                                                <div className="dropdown-container">
                                                    <button
                                                        style={{ backgroundColor: "white" }}
                                                        className="btn dropdown-toggle dropdown-button"
                                                        type="button"
                                                        id="projectDropdown"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        aria-required="true"
                                                        aria-describedby="projectFeedback"
                                                        disabled={choice === 'team'}
                                                    >
                                                        {selectedProject ? selectedProject.name : "Project"}
                                                    </button>
                                                    {IndividualValidProject === false && (
                                                        <div >
                                                            <p className='text-danger'>Please Choose an Project</p>
                                                        </div>
                                                    )}
                                                    <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="projectDropdown">
                                                        {userproject.map((project) => (

                                                            <li key={project._id}>
                                                                <a
                                                                    role="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => {
                                                                        setSelectedProject(project);
                                                                    }}
                                                                >
                                                                    <div className='d-flex justify-content-between'>{project.name}
                                                                        {(project.Type === "new" && new Date(project.ToDate).toLocaleDateString('en-GB') < new Date().toLocaleDateString('en-GB')) ? (
                                                                            <span className="bg-danger text-light p-1 rounded">Late</span>
                                                                        ) : (<span className="bg-danger text-light p-1 rounded">{project.Type}</span>)}
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            style={{ marginLeft: "35%" }}
                                            disabled={choice === 'team'}
                                        >
                                            Save
                                        </button>
                                    </form>

                                </div>
                                <div className="col-md-6 " >
                                    <form onSubmit={savebutton}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="select1" className={`form-label fw-bold ${choice === "individual" ? 'text-secondary' : 'text-dark'}`}>Employee 1</label>
                                                <div className="dropdown dropdown-container">
                                                    <button
                                                        style={{ backgroundColor: "white" }}
                                                        className="btn dropdown-toggle dropdown-button"
                                                        type="button"
                                                        id="dropdownMenuButton1"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        disabled={choice === 'individual'}
                                                    >
                                                        {selectedOptions.select1 ? employees.find(emp => emp._id === selectedOptions.select1).Name : 'Select'}
                                                    </button>
                                                    {!validEmp1 && (
                                                        <div>
                                                            <p className='text-danger'>Please Choose an Employee</p>
                                                        </div>
                                                    )}
                                                    <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenuButton1">
                                                        {getDisabledOptionsForSelect().map(option => (
                                                            <li key={option._id}>
                                                                <button
                                                                    className={`dropdown-item ${option.disabled ? 'disabled' : ''}`}
                                                                    type="button"
                                                                    onClick={() => { handleSelectChange({ target: { value: option._id } }, 'select1'); }}
                                                                    disabled={option.disabled}
                                                                >
                                                                    {option.Name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <label htmlFor="select3" className={`form-label fw-bold ${choice === "individual" ? 'text-secondary' : 'text-dark'}`}>Employee 3</label>
                                                <div className="dropdown">
                                                    <button
                                                        style={{ backgroundColor: "white" }}
                                                        className="btn dropdown-toggle dropdown-button"
                                                        type="button"
                                                        id="dropdownMenuButton3"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        disabled={choice === 'individual' || selectedOptions.select2 === ''}
                                                    >
                                                        {selectedOptions.select3 ? employees.find(emp => emp._id === selectedOptions.select3).Name : 'Select'}
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenuButton3">
                                                        {getDisabledOptionsForSelect().map(option => (
                                                            <li key={option._id}>
                                                                <button
                                                                    className={`dropdown-item ${option.disabled ? 'disabled' : ''}`}
                                                                    type="button"
                                                                    onClick={() => { handleSelectChange({ target: { value: option._id } }, 'select3'); }}
                                                                    disabled={option.disabled}
                                                                >
                                                                    {option.Name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="select2" className={`form-label fw-bold ${choice === "individual" ? 'text-secondary' : 'text-dark'}`}>Employee 2</label>
                                                <div className="dropdown">
                                                    <button
                                                        style={{ backgroundColor: "white" }}
                                                        className="btn  dropdown-toggle dropdown-button"
                                                        type="button"
                                                        id="dropdownMenuButton2"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        disabled={choice === 'individual' || selectedOptions.select1 === ''}
                                                    >
                                                        {selectedOptions.select2 ? employees.find(emp => emp._id === selectedOptions.select2).Name : 'Select'}
                                                    </button>
                                                    {!validEmp2 && (
                                                        <div>
                                                            <p className='text-danger'>Please Choose an Employee</p>
                                                        </div>
                                                    )}
                                                    <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenuButton2">
                                                        {getDisabledOptionsForSelect().map(option => (
                                                            <li key={option._id}>
                                                                <button
                                                                    className={`dropdown-item ${option.disabled ? 'disabled' : ''}`}
                                                                    type="button"
                                                                    onClick={() => { handleSelectChange({ target: { value: option._id } }, 'select2'); }}
                                                                    disabled={option.disabled}
                                                                >
                                                                    {option.Name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <label htmlFor="select4" className={`form-label fw-bold ${choice === "individual" ? 'text-secondary' : 'text-dark'}`}>Employee 4</label>
                                                <div className="dropdown">
                                                    <button
                                                        style={{ backgroundColor: "white" }}
                                                        className="btn dropdown-toggle dropdown-button"
                                                        type="button"
                                                        id="dropdownMenuButton4"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        disabled={choice === 'individual' || selectedOptions.select3 === ''}
                                                    >
                                                        {selectedOptions.select4 ? employees.find(emp => emp._id === selectedOptions.select4).Name : 'Select'}
                                                    </button>

                                                    <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenuButton4">
                                                        {getDisabledOptionsForSelect().map(option => (
                                                            <li key={option._id}>
                                                                <button
                                                                    className={`dropdown-item ${option.disabled ? 'disabled' : ''}`}
                                                                    type="button"
                                                                    onClick={() => { handleSelectChange({ target: { value: option._id } }, 'select4') }}
                                                                    disabled={option.disabled}
                                                                >
                                                                    {option.Name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="projects my-3">
                                                    <label htmlFor="projectDropdown" className={`form-label fw-bold ${choice === "individual" ? 'text-secondary' : 'text-dark'}`}>Select Project</label>
                                                    <div className="dropdown-container">
                                                        <button
                                                            style={{ backgroundColor: "white" }}
                                                            className="btn dropdown-toggle dropdown-button"
                                                            type="button"
                                                            id="projectDropdown"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            aria-required="true"
                                                            aria-describedby="projectFeedback"
                                                            disabled={choice === 'individual'}
                                                        >
                                                            {SelectedTeamProject ? SelectedTeamProject.name : "Project"}
                                                        </button>
                                                        {ValidTeamProject === false && (
                                                            <div >
                                                                <p className='text-danger'>Please Choose an Project</p>
                                                            </div>
                                                        )}
                                                        <ul className="dropdown-menu dropdown-menu-custom w-25" aria-labelledby="projectDropdown">
                                                            {teamproject.map((project) => (
                                                                <li key={project._id}>
                                                                    <a
                                                                        role="button"
                                                                        className="dropdown-item"
                                                                        onClick={() => {
                                                                            setSelectedTeamProject(project);
                                                                        }}
                                                                    >
                                                                        <div className='d-flex justify-content-between'>{project.name}
                                                                            {(project.Type === "new" && new Date(project.ToDate).toLocaleDateString('en-GB') < new Date().toLocaleDateString('en-GB')) ? (
                                                                                <span className="bg-danger text-light p-1 rounded">Late</span>
                                                                            ) : (<span className="bg-danger text-light p-1 rounded">{project.Type}</span>)}
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-success mt-3" style={{ marginLeft: "40%" }} type="submit" disabled={choice === 'individual'}>Save</button>
                                    </form>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Submission</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to submit the form?
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={submit}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}

        </>
    );
}
export default AssignProject;