import { useLocation, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

export default function ReferralDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const referral = state?.referral;

  return (
    <main className="flex-1 p-10">
      <div
            className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
            onClick={() => navigate(-1)}
        >
            <FaArrowLeft />
            <span>Back to View Patient Details</span>
        </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">
          Referral Details
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <strong>Referral ID:</strong>{" "}
            {referral?.id}
          </div>

          <div>
            <strong>Referral Type:</strong>{" "}
            {referral?.referralType}
          </div>

          <div>
            <strong>Status:</strong>{" "}
            {referral?.status}
          </div>

          <div>
            <strong>Created Date:</strong>{" "}
            {referral?.createdDate}
          </div>
        </div>
      </div>
    </main>
  );
}