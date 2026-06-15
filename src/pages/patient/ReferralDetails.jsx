import { useLocation, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

export default function ReferralDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const referral = state?.referral;

  return (
    <main className="flex-1">
      <div
            className="flex items-center gap-2 mb-6 cursor-pointer text-primary font-medium"
            onClick={() => navigate(-1)}
        >
            <FaArrowLeft />
            <span>Back to View Patient Details</span>
        </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          Referral Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 wrap-break-word">
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
