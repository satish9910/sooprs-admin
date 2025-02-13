import { NavLink } from "react-router-dom";
import { Card, Typography, List, ListItemPrefix } from "@material-tailwind/react";
import PropTypes from "prop-types";

function Sidebar({ routes, isOpen }) {
  return (
    <div className={`fixed md:relative inset-y-0 left-0 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <Card className="h-screen w-72 border  border-blue-100 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="mb-4 flex items-center gap-4 p-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center">
            <img src="https://sooprs.com/assets/images/sooprs_white_logo.webp" alt="brand" className="h-full w-full object-cover" />
          </div>
          <Typography variant="h5" color="white">
            Sooprs
          </Typography>
        </div>
        <List>
          {routes.map(({ layout, pages }) =>
            layout === "dashboard"
              ? pages.map(({ name, path, icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive ? "bg-blue-500 text-white" : "text-white hover:bg-gray-700"
                      }`
                    }
                  >
                    <ListItemPrefix className="mr-2">{icon}</ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      {name}
                    </Typography>
                  </NavLink>
                ))
              : null
          )}
        </List>
      </Card>
    </div>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.string.isRequired,
      pages: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          icon: PropTypes.node.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
