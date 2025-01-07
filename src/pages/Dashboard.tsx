const Dashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Access your features below:</p>
      <ul>
        <li><a href="/profile">View Profile</a></li>
        <li><a href="/projects">Manage Projects</a></li>
      </ul>
    </div>
  );
};

export default Dashboard;
