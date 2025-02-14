import { useState, useEffect, useCallback } from "react";
import React from "react";
import {
  Button,
  Card,
  Dialog,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../components/CustomTable";
import { useNavigate } from "react-router-dom";

function Coupon() {
  const [leads, setLeads] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("1"); // Default to Discount type
  const [credits, setCredits] = useState("");
  const [discountValue, setDiscountValue] = useState(""); // New state for discount value
  const [discountType, setDiscountType] = useState(""); // New state for discount type
  const [open, setOpen] = React.useState(false);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const handleOpen = () => setOpen((cur) => !cur);

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/get-coupon-code`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLeads();
  }, [token, fetchLeads]);

  const deleteLead = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleCouponSubmit = async () => {
    try {
      const data = new URLSearchParams();
      data.append('code_name', couponCode);
      data.append('type', couponType);
      data.append('credits', credits);
      data.append('discount_value', discountValue); // Add discount value
      data.append('discount_type', discountType); // Add discount type
      data.append('status', '1'); // Default status to active

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/create-coupon-code`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Coupon added:", response.data);
      fetchLeads(); // Fetch leads again to include the newly added coupon
      handleOpen(); // Close modal after submission
    } catch (error) {
      console.error("Error submitting coupon:", error);
    }
  };

  const columns = [
    {
      key: "code_name",
      label: "Coupon Code",
      render: (row) => row.code_name,
    },
    {
      key: "type",
      label: "Type",
      render: (row) => row.type === "1" ? "Discount" : "Other",
    },
    {
      key: "credits",
      label: "Discount",
      render: (row) => row.credits,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => row.status === "1" ? "Active" : "Inactive",
    },
    {
      key: "created_at",
      label: "Date & Time",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Coupon Codes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View All Coupon Codes
            </Typography>
          </div>
          <Button onClick={handleOpen}>Add Coupon</Button>
        </div>
      </CardHeader>

      <CardBody>
        <CustomTable
          columns={columns}
          data={leads}
          onDelete={deleteLead}
          onEdit={handleEdit}
        />
      </CardBody>

      <CardFooter className="flex justify-between">
        {/* Pagination Buttons (Add your pagination logic here if needed) */}
      </CardFooter>

      {/* Modal for adding/editing coupon */}
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="gray-300">
              Add Coupon Code
            </Typography>
            <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
              Enter the coupon details.
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Coupon Code
            </Typography>
            <Input
              label="Coupon Name"
              size="lg"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Typography className="-mb-2" variant="h6">
              Type
            </Typography>
            <select
              className="w-full p-2 border rounded-lg"
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
            >
              <option value="1">Discount</option>
              <option value="2">Other</option>
            </select>
            <Typography className="-mb-2" variant="h6">
              Credits
            </Typography>
            <Input
              label="Credits"
              size="lg"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
            <Typography className="-mb-2" variant="h6">
              Discount Value
            </Typography>
            <Input
              label="Discount Value"
              size="lg"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
            <Typography className="-mb-2" variant="h6">
              Discount Type
            </Typography>
            <Input
              label="Discount Type"
              size="lg"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleCouponSubmit} fullWidth>
              Add Coupon
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </Card>
  );
}

export default Coupon;
