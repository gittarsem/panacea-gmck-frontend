import { useState } from "react";
import { Check, LockKeyhole, ShieldCheck, X } from "lucide-react";
import {
    accessAdminUsers,
    approveAdmin,
    type AdminUser,
} from "@/api/adminApi";

export default function AdminManagement() {
    const [unlocked, setUnlocked] = useState(false);
    const [users, setUsers] = useState<AdminUser[]>([]);

    const [accessPassword, setAccessPassword] = useState("");
    const [approvalPassword, setApprovalPassword] = useState("");

    const [selectedUser, setSelectedUser] =
        useState<AdminUser | null>(null);

    const [loading, setLoading] = useState(false);
    const [approving, setApproving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUnlock = async () => {
        if (!accessPassword.trim()) {
            setError("Approval password is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data = await accessAdminUsers(
                accessPassword
            );

            setUsers(data);
            setUnlocked(true);
            setAccessPassword("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to unlock admin management."
            );
        } finally {
            setLoading(false);
        }
    };

    const openApproval = (user: AdminUser) => {
        setSelectedUser(user);
        setApprovalPassword("");
        setError("");
        setSuccess("");
    };

    const closeApproval = () => {
        if (approving) return;

        setSelectedUser(null);
        setApprovalPassword("");
        setError("");
    };

    const handleApprove = async () => {
        if (!selectedUser) return;

        if (!approvalPassword.trim()) {
            setError("Approval password is required.");
            return;
        }

        try {
            setApproving(true);
            setError("");
            setSuccess("");

            const updatedUser = await approveAdmin(
                selectedUser.id,
                approvalPassword
            );

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user.id === updatedUser.id
                        ? updatedUser
                        : user
                )
            );

            setSuccess(
                `${selectedUser.fullName} is now an administrator.`
            );

            setSelectedUser(null);
            setApprovalPassword("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to approve administrator."
            );
        } finally {
            setApproving(false);
        }
    };

    const isAdmin = (user: AdminUser) =>
        user.roles?.some(
            (role) =>
                role === "ROLE_ADMIN" ||
                role === "ADMIN"
        );

    return (
        <section className="admin-management">
            <style>{`
                .admin-management {
                    width: 100%;
                    color: #24211D;
                }

                .admin-management-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 24px;
                    margin-bottom: 28px;
                }

                .admin-management-eyebrow {
                    margin-bottom: 8px;
                    color: #9A7135;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.16em;
                }

                .admin-management-title {
                    margin: 0;
                    font-family: Georgia, serif;
                    font-size: clamp(30px, 3vw, 44px);
                    font-weight: 500;
                    line-height: 1;
                }

                .admin-management-subtitle {
                    margin: 10px 0 0;
                    color: #6F665A;
                    font-size: 13px;
                }

                .admin-management-count {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 13px;
                    border: 1px solid #D8CCBA;
                    background: #FFFDF8;
                    color: #805C2A;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    white-space: nowrap;
                }

                .admin-management-alert {
                    margin-bottom: 18px;
                    padding: 12px 14px;
                    border: 1px solid;
                    font-size: 12px;
                }

                .admin-management-alert.error {
                    color: #8F4841;
                    background: #F8ECEA;
                    border-color: #D9AAA5;
                }

                .admin-management-alert.success {
                    color: #5C7540;
                    background: #F0F4E9;
                    border-color: #C7D5B4;
                }

                .admin-management-panel {
                    overflow: hidden;
                    border: 1px solid #D8CCBA;
                    background: #FFFDF8;
                    box-shadow: 0 8px 25px rgba(72, 55, 30, 0.06);
                }

                .admin-management-panel-header {
                    padding: 20px 22px;
                    border-bottom: 1px solid #E1D7C7;
                }

                .admin-management-panel-header h2 {
                    margin: 0;
                    font-family: Georgia, serif;
                    font-size: 21px;
                    font-weight: 500;
                }

                .admin-management-panel-header p {
                    margin: 5px 0 0;
                    color: #847A6C;
                    font-size: 12px;
                }

                .admin-management-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .admin-management-table {
                    width: 100%;
                    min-width: 900px;
                    border-collapse: collapse;
                }

                .admin-management-table th {
                    padding: 13px 18px;
                    border-bottom: 1px solid #E1D7C7;
                    background: #FBF6ED;
                    color: #847A6C;
                    text-align: left;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    white-space: nowrap;
                }

                .admin-management-table td {
                    padding: 16px 18px;
                    border-bottom: 1px solid #EEE6DA;
                    color: #625B52;
                    font-size: 12px;
                    vertical-align: middle;
                }

                .admin-management-table tbody tr:last-child td {
                    border-bottom: 0;
                }

                .admin-management-table tbody tr:hover {
                    background: #FBF6ED;
                }

                .admin-management-user {
                    color: #24211D;
                    font-weight: 800;
                }

                .admin-management-email {
                    color: #625B52;
                }

                .admin-management-role {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 8px;
                    border: 1px solid #D8CCBA;
                    background: #FBF6ED;
                    color: #6F665A;
                    font-size: 8px;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                }

                .admin-management-role.admin {
                    border-color: #CDBB9C;
                    background: #F7E5B8;
                    color: #805C2A;
                }

                .admin-management-approve {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 11px;
                    border: 1px solid #CDBB9C;
                    border-radius: 5px;
                    background: #F7E5B8;
                    color: #805C2A;
                    font-size: 9px;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                }

                .admin-management-approve:hover {
                    background: #EFD79F;
                }

                .admin-management-locked {
                    min-height: 360px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    text-align: center;
                }

                .admin-management-lock-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 58px;
                    height: 58px;
                    margin-bottom: 18px;
                    border: 1px solid #D8CCBA;
                    background: #FBF6ED;
                    color: #9A7135;
                }

                .admin-management-locked h2 {
                    margin: 0 0 7px;
                    font-family: Georgia, serif;
                    font-size: 24px;
                    font-weight: 500;
                }

                .admin-management-locked p {
                    max-width: 420px;
                    margin: 0 0 25px;
                    color: #847A6C;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .admin-management-password-form {
                    display: flex;
                    width: min(430px, 100%);
                    gap: 8px;
                }

                .admin-management-password-form input {
                    flex: 1;
                    min-width: 0;
                    box-sizing: border-box;
                    padding: 12px 13px;
                    border: 1px solid #D8CCBA;
                    outline: none;
                    background: #FFFDF8;
                    color: #24211D;
                    font-size: 13px;
                }

                .admin-management-password-form input:focus {
                    border-color: #9A7135;
                    box-shadow: 0 0 0 2px rgba(154, 113, 53, 0.08);
                }

                .admin-management-unlock {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 12px 15px;
                    border: 1px solid #9A7135;
                    border-radius: 5px;
                    background: #9A7135;
                    color: #FFFDF8;
                    font-size: 9px;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .admin-management-unlock:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .admin-management-empty {
                    min-height: 240px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 30px;
                    color: #847A6C;
                    text-align: center;
                }

                .admin-management-empty strong {
                    color: #625B52;
                    font-size: 11px;
                    letter-spacing: 0.1em;
                }

                .admin-management-empty span {
                    font-size: 12px;
                }

                .admin-management-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: rgba(53, 43, 29, 0.28);
                }

                .admin-management-modal {
                    width: min(460px, 100%);
                    border: 1px solid #D8CCBA;
                    background: #FFFDF8;
                    box-shadow: 0 20px 60px rgba(72, 55, 30, 0.18);
                }

                .admin-management-modal-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding: 22px;
                    border-bottom: 1px solid #E1D7C7;
                }

                .admin-management-modal-header h2 {
                    margin: 0;
                    font-family: Georgia, serif;
                    font-size: 24px;
                    font-weight: 500;
                }

                .admin-management-modal-close {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border: 1px solid #D8CCBA;
                    background: #FBF6ED;
                    color: #625B52;
                    cursor: pointer;
                }

                .admin-management-user-card {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin: 20px 22px 14px;
                    padding: 13px 14px;
                    border: 1px solid #E1D7C7;
                    background: #FBF6ED;
                }

                .admin-management-user-card strong {
                    color: #24211D;
                    font-size: 13px;
                }

                .admin-management-user-card span {
                    color: #847A6C;
                    font-size: 11px;
                }

                .admin-management-warning {
                    margin: 0 22px 20px;
                    padding: 11px 13px;
                    border: 1px solid #DCC48F;
                    background: #F7E5B8;
                    color: #805C2A;
                    font-size: 11px;
                    line-height: 1.5;
                }

                .admin-management-field {
                    display: block;
                    margin: 0 22px 18px;
                }

                .admin-management-field span {
                    display: block;
                    margin-bottom: 7px;
                    color: #847A6C;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                }

                .admin-management-field input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 12px 13px;
                    border: 1px solid #D8CCBA;
                    outline: none;
                    background: #FFFDF8;
                    color: #24211D;
                    font-size: 13px;
                }

                .admin-management-field input:focus {
                    border-color: #9A7135;
                    box-shadow: 0 0 0 2px rgba(154, 113, 53, 0.08);
                }

                .admin-management-modal-alert {
                    margin: 0 22px 18px;
                    padding: 11px 13px;
                    border: 1px solid #D9AAA5;
                    background: #F8ECEA;
                    color: #8F4841;
                    font-size: 11px;
                }

                .admin-management-modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 9px;
                    padding: 16px 22px 20px;
                    border-top: 1px solid #E1D7C7;
                }

                .admin-management-cancel,
                .admin-management-confirm {
                    padding: 10px 14px;
                    border-radius: 5px;
                    font-size: 9px;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                }

                .admin-management-cancel {
                    border: 1px solid #D8CCBA;
                    background: #FBF6ED;
                    color: #625B52;
                }

                .admin-management-confirm {
                    border: 1px solid #9A7135;
                    background: #9A7135;
                    color: #FFFDF8;
                }

                .admin-management-cancel:disabled,
                .admin-management-confirm:disabled,
                .admin-management-approve:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                @media (max-width: 800px) {
                    .admin-management-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .admin-management-count {
                        align-self: flex-start;
                    }

                    .admin-management-password-form {
                        flex-direction: column;
                    }
                }
            `}</style>

            <div className="admin-management-header">
                <div>
                    <div className="admin-management-eyebrow">
                        ACCESS CONTROL
                    </div>

                    <h1 className="admin-management-title">
                        Admin Management
                    </h1>

                    <p className="admin-management-subtitle">
                        Manage administrator access for PANACEA.
                    </p>
                </div>

                {unlocked && (
                    <div className="admin-management-count">
                        <ShieldCheck size={16} />
                        {users.length} USERS
                    </div>
                )}
            </div>

            {error && !selectedUser && (
                <div className="admin-management-alert error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-management-alert success">
                    {success}
                </div>
            )}

            <div className="admin-management-panel">
                {!unlocked ? (
                    <div className="admin-management-locked">
                        <div className="admin-management-lock-icon">
                            <LockKeyhole size={25} />
                        </div>

                        <h2>
                            Protected Area
                        </h2>

                        <p>
                            Administrator management is protected.
                            Enter the approval password to view
                            registered users and manage admin access.
                        </p>

                        <div className="admin-management-password-form">
                            <input
                                type="password"
                                value={accessPassword}
                                onChange={(event) => {
                                    setAccessPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                placeholder="Approval password"
                                disabled={loading}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleUnlock();
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="admin-management-unlock"
                                onClick={handleUnlock}
                                disabled={loading}
                            >
                                <LockKeyhole size={14} />

                                {loading
                                    ? "VERIFYING..."
                                    : "UNLOCK"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="admin-management-panel-header">
                            <h2>
                                Registered Users
                            </h2>

                            <p>
                                Existing administrator accounts and
                                registered users.
                            </p>
                        </div>

                        {users.length === 0 ? (
                            <div className="admin-management-empty">
                                <ShieldCheck size={28} />

                                <strong>
                                    NO USERS FOUND
                                </strong>

                                <span>
                                    No registered accounts are
                                    available.
                                </span>
                            </div>
                        ) : (
                            <div className="admin-management-table-wrap">
                                <table className="admin-management-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                USER
                                            </th>

                                            <th>
                                                EMAIL
                                            </th>

                                            <th>
                                                PHONE
                                            </th>

                                            <th>
                                                COLLEGE
                                            </th>

                                            <th>
                                                LOCATION
                                            </th>

                                            <th>
                                                ROLE
                                            </th>

                                            <th>
                                                ACTION
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.map((user) => {
                                            const admin =
                                                isAdmin(user);

                                            return (
                                                <tr
                                                    key={
                                                        user.id
                                                    }
                                                >
                                                    <td>
                                                        <div className="admin-management-user">
                                                            {
                                                                user.fullName
                                                            }
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="admin-management-email">
                                                            {
                                                                user.email
                                                            }
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {
                                                            user.phoneNumber ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            user.collegeName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {[
                                                            user.city,
                                                            user.state,
                                                        ]
                                                            .filter(
                                                                Boolean
                                                            )
                                                            .join(
                                                                ", "
                                                            ) ||
                                                            "—"}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                admin
                                                                    ? "admin-management-role admin"
                                                                    : "admin-management-role"
                                                            }
                                                        >
                                                            {admin && (
                                                                <ShieldCheck
                                                                    size={
                                                                        12
                                                                    }
                                                                />
                                                            )}

                                                            {admin
                                                                ? "ADMIN"
                                                                : "USER"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {admin ? (
                                                            <span className="admin-management-role admin">
                                                                APPROVED
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="admin-management-approve"
                                                                onClick={() =>
                                                                    openApproval(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                <Check
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                APPROVE
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedUser && (
                <div
                    className="admin-management-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeApproval();
                        }
                    }}
                >
                    <div className="admin-management-modal">
                        <div className="admin-management-modal-header">
                            <div>
                                <div className="admin-management-eyebrow">
                                    ADMIN APPROVAL
                                </div>

                                <h2>
                                    Approve Administrator
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="admin-management-modal-close"
                                onClick={
                                    closeApproval
                                }
                                disabled={
                                    approving
                                }
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="admin-management-user-card">
                            <strong>
                                {
                                    selectedUser.fullName
                                }
                            </strong>

                            <span>
                                {
                                    selectedUser.email
                                }
                            </span>
                        </div>

                        <div className="admin-management-warning">
                            This will grant this account
                            <strong>
                                {" "}
                                ROLE_ADMIN
                            </strong>{" "}
                            access.
                        </div>

                        <label className="admin-management-field">
                            <span>
                                APPROVAL PASSWORD
                            </span>

                            <input
                                type="password"
                                value={
                                    approvalPassword
                                }
                                onChange={(event) => {
                                    setApprovalPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                placeholder="Enter approval password"
                                autoFocus
                                disabled={
                                    approving
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        handleApprove();
                                    }
                                }}
                            />
                        </label>

                        {error && (
                            <div className="admin-management-modal-alert">
                                {error}
                            </div>
                        )}

                        <div className="admin-management-modal-actions">
                            <button
                                type="button"
                                className="admin-management-cancel"
                                onClick={
                                    closeApproval
                                }
                                disabled={
                                    approving
                                }
                            >
                                CANCEL
                            </button>

                            <button
                                type="button"
                                className="admin-management-confirm"
                                onClick={
                                    handleApprove
                                }
                                disabled={
                                    approving
                                }
                            >
                                {approving
                                    ? "APPROVING..."
                                    : "APPROVE ADMIN"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}