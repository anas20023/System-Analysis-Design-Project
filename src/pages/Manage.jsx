import { useEffect, useState } from "react";
import ResourceManage from "../Components/Presentation/ResourceManage";
import Statistics from "../Components/Presentation/Statistics";
import SubscriptionManage from "../Components/Presentation/SubscriptionManage";
import UserManage from "../Components/Presentation/UserManage";
import axios from "axios";

const Manage = () => {
  const [user, setUser] = useState([]);
  const url = import.meta.env.VITE_SERVER;

  const getUser = async () => {
    try {
      const res = await axios.get(`${url}/users`);
      //console.log(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

const handleDeleteUser = async (id) => {
  try {
    await axios.delete(`${url}/users/drop/${id}`);
    setUser(prev => prev.filter(user => user.id !== id));
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-blue-50 text-black min-h-screen w-full mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center">Management Dashboard</h1>

      {/* Statistics Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Statistics Overview</h2>
        <Statistics />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">User Management</h2>
          <UserManage users={user} handleDeleteUser={handleDeleteUser}/>
        </div>

        {/* Resource and Subscription Management Container */}
        <div className="flex flex-col gap-6">
          {/* Resource Management Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Resource Management</h2>
            <ResourceManage />
          </div>

          {/* Subscription Management Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Subscription Management</h2>
            <SubscriptionManage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;