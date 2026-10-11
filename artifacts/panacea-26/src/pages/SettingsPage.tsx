import { useEffect, useState, type FormEvent } from "react";



import {

  Eye,

  EyeOff,

  Save,

  LockKeyhole,

  Pencil,

  X,

} from "lucide-react";



import { useLocation } from "wouter";



import PageTitle from "../components/PageTitle";



import { useAuth } from "../context/AuthContext";



import {

  profileApi,

  type ProfileResponse,

} from "../api/profileApi";



const COLLEGES = [

  "IIIT Una",

  "Govt. Medical College Jammu",

  "Govt. Medical College Anantnag",

  "Govt. Medical College Udhampur",

  "ASCOMS Jammu",

  "AIIMS Jammu",

  "IIT Jammu",

  "IIM Jammu",

  "Govt. Medical College Rajouri",

  "Govt. Medical College Srinagar",

  "SKIMS",

  "Govt. Medical College Baramulla",

  "Govt. Medical College Doda",

];



const STATES = [

  "Andhra Pradesh",

  "Arunachal Pradesh",

  "Assam",

  "Bihar",

  "Chhattisgarh",

  "Goa",

  "Gujarat",

  "Haryana",

  "Himachal Pradesh",

  "Jharkhand",

  "Karnataka",

  "Kerala",

  "Madhya Pradesh",

  "Maharashtra",

  "Manipur",

  "Meghalaya",

  "Mizoram",

  "Nagaland",

  "Odisha",

  "Punjab",

  "Rajasthan",

  "Sikkim",

  "Tamil Nadu",

  "Telangana",

  "Tripura",

  "Uttar Pradesh",

  "Uttarakhand",

  "West Bengal",

  "Andaman and Nicobar Islands",

  "Chandigarh",

  "Dadra and Nagar Haveli and Daman and Diu",

  "Delhi",

  "Jammu and Kashmir",

  "Ladakh",

  "Lakshadweep",

  "Puducherry",

];



type EditableProfile = {

  fullName: string;

  collegeName: string;

  city: string;

  state: string;

};



export default function SettingsPage() {

  const { user, refreshUser } = useAuth();



  const [, navigate] = useLocation();



  const [profile, setProfile] =

    useState<ProfileResponse | null>(null);



  const [form, setForm] = useState<EditableProfile>({

    fullName: "",

    collegeName: "",

    city: "",

    state: "",

  });



  /*

   * Profile editing is OFF by default.

   * User must explicitly click EDIT DETAILS.

   */

  const [editingProfile, setEditingProfile] =

    useState(false);



  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);



  const [message, setMessage] = useState("");

  const [error, setError] = useState("");



  /*

   * Password section

   */

  const [showPasswordPanel, setShowPasswordPanel] =

    useState(false);



  const [currentPassword, setCurrentPassword] =

    useState("");



  const [newPassword, setNewPassword] =

    useState("");



  const [confirmPassword, setConfirmPassword] =

    useState("");



  const [showCurrent, setShowCurrent] =

    useState(false);



  const [showNew, setShowNew] =

    useState(false);



  const [showConfirm, setShowConfirm] =

    useState(false);



  const [changingPassword, setChangingPassword] =

    useState(false);



  /*

   * Load profile when authenticated.

   */

  useEffect(() => {

    if (!user) {

      navigate("/login");

      return;

    }



    loadProfile();

  }, [user]);



  const loadProfile = async () => {

    try {

      setLoading(true);

      setError("");



      const response =

        await profileApi.getProfile();



      setProfile(response);



      setForm({

        fullName: response.fullName,

        collegeName: response.collegeName,

        city: response.city,

        state: response.state,

      });

    } catch (err: any) {

      setError(

        err?.response?.data?.message ||

          err?.message ||

          "Unable to load your account information."

      );

    } finally {

      setLoading(false);

    }

  };



  /*

   * Update editable form field.

   */

  const updateField = (

    field: keyof EditableProfile,

    value: string

  ) => {

    setForm((current) => ({

      ...current,

      [field]: value,

    }));



    setMessage("");

    setError("");

  };



  /*

   * Validate editable profile information.

   */

  const validateProfile = () => {

    const fullName = form.fullName.trim();

    const city = form.city.trim();



    if (!fullName || fullName.length < 2) {

      return "Please enter a valid full name.";

    }



    if (

      !/^[A-Za-z][A-Za-z .'-]{1,99}$/.test(

        fullName

      )

    ) {

      return "Please enter a valid full name.";

    }



    if (!form.collegeName.trim()) {

      return "Please select your college.";

    }



    if (

      !city ||

      !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(city)

    ) {

      return "Please enter a valid city.";

    }



    if (!form.state) {

      return "Please select your state / UT.";

    }



    return null;

  };



  /*

   * Save profile changes.

   */

  const saveProfile = async (

    event: FormEvent

  ) => {

    event.preventDefault();



    const validationError =

      validateProfile();



    if (validationError) {

      setError(validationError);

      return;

    }



    try {

      setSaving(true);

      setError("");

      setMessage("");



      const response =

        await profileApi.updateProfile({

          fullName: form.fullName.trim(),

          collegeName: form.collegeName.trim(),

          city: form.city.trim(),

          state: form.state,

        });



      setProfile(response);



      setForm({

        fullName: response.fullName,

        collegeName:

          response.collegeName,

        city: response.city,

        state: response.state,

      });



      await refreshUser();



      /*

       * Return to display-only mode

       * after successful save.

       */

      setEditingProfile(false);



      setMessage(

        "ACCOUNT DETAILS UPDATED SUCCESSFULLY."

      );

    } catch (err: any) {

      setError(

        err?.response?.data?.message ||

          err?.message ||

          "Unable to update your account details."

      );

    } finally {

      setSaving(false);

    }

  };



  /*

   * Cancel profile editing.

   *

   * Restore the values originally

   * loaded from the backend.

   */

  const cancelEditing = () => {

    if (profile) {

      setForm({

        fullName: profile.fullName,

        collegeName: profile.collegeName,

        city: profile.city,

        state: profile.state,

      });

    }



    setEditingProfile(false);

    setError("");

    setMessage("");

  };



  /*

   * Change password.

   */

  const changePassword = async (

    event: FormEvent

  ) => {

    event.preventDefault();



    setError("");

    setMessage("");



    if (!currentPassword) {

      setError(

        "Enter your current password."

      );

      return;

    }



    if (newPassword.length < 8) {

      setError(

        "New password must be at least 8 characters."

      );

      return;

    }



    if (!/[A-Za-z]/.test(newPassword)) {

      setError(

        "New password must contain at least one letter."

      );

      return;

    }



    if (!/\d/.test(newPassword)) {

      setError(

        "New password must contain at least one number."

      );

      return;

    }



    if (newPassword !== confirmPassword) {

      setError(

        "New passwords do not match."

      );

      return;

    }



    if (currentPassword === newPassword) {

      setError(

        "New password must be different from your current password."

      );

      return;

    }



    try {

      setChangingPassword(true);



      await profileApi.changePassword({

        currentPassword,

        newPassword,

        confirmPassword,

      });



      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");



      setShowPasswordPanel(false);



      setMessage(

        "PASSWORD CHANGED SUCCESSFULLY."

      );

    } catch (err: any) {

      setError(

        err?.response?.data?.message ||

          err?.message ||

          "Unable to change your password."

      );

    } finally {

      setChangingPassword(false);

    }

  };



  /*

   * Loading state

   */

  if (!user || loading) {

    return (

      <main className="shell">

        <PageTitle

          tag="Your PANACEA account"

          title="ACCOUNT."

          sub="Loading your account information."

        />

      </main>

    );

  }



  return (

    <main

      className="shell"

      style={{

        paddingBottom: 100,

      }}

    >

      <PageTitle

        tag="Your PANACEA ’26 account"

        title="ACCOUNT."

        sub="Manage your PANACEA ’26 account information."

      />



      <div

        style={{

          maxWidth: 900,

          margin: "35px auto 0",

        }}

      >

        {/* =====================================================

            ACCOUNT INFORMATION

        \====================================================== */}



        <section

          style={{

            border:

              "1px solid rgba(0,0,0,0.7)",

            boxShadow: "10px 10px 0 #111",

            background:

              "var(--paper, #f5eddf)",

          }}

        >

          {/* Section header */}



          <div

            style={{

              padding: "26px 40px",

              borderBottom:

                "1px solid rgba(0,0,0,0.7)",

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 20,

            }}

          >

            <div className="mono">

              ACCOUNT INFORMATION

            </div>



            {!editingProfile ? (

              <button

                type="button"

                className="button paper"

                onClick={() => {

                  setEditingProfile(true);

                  setError("");

                  setMessage("");

                }}

                style={{

                  display: "inline-flex",

                  alignItems: "center",

                  gap: 8,

                }}

              >

                <Pencil size={15} />

                EDIT DETAILS

              </button>

            ) : (

              <button

                type="button"

                className="button paper"

                onClick={cancelEditing}

                style={{

                  display: "inline-flex",

                  alignItems: "center",

                  gap: 8,

                }}

              >

                <X size={15} />

                CANCEL

              </button>

            )}

          </div>



          {/* =================================================

              DISPLAY MODE

          \================================================== */}



          {!editingProfile ? (

            <>

              <ReadonlyRow

                label="FULL NAME"

                value={

                  profile?.fullName || "—"

                }

              />



              <ReadonlyRow

                label="EMAIL"

                value={

                  profile?.email ||

                  user.email ||

                  "—"

                }

                hint="Email cannot be changed."

              />



              <ReadonlyRow

                label="PHONE"

                value={

                  profile?.phoneNumber ||

                  user.phoneNumber ||

                  "—"

                }

                hint="Phone number cannot be changed."

              />



              <ReadonlyRow

                label="COLLEGE"

                value={

                  profile?.collegeName ||

                  "—"

                }

              />



              <ReadonlyRow

                label="CITY"

                value={

                  profile?.city || "—"

                }

              />



              <ReadonlyRow

                label="STATE / UT"

                value={

                  profile?.state || "—"

                }

                last

              />

            </>

          ) : (

            /* ===============================================

               EDIT MODE

            \================================================ */



            <form onSubmit={saveProfile}>

              <EditableRow

                label="FULL NAME"

                value={form.fullName}

                onChange={(value) =>

                  updateField(

                    "fullName",

                    value

                  )

                }

              />



              {/* EMAIL IS ALWAYS READ-ONLY */}



              <ReadonlyRow

                label="EMAIL"

                value={

                  profile?.email ||

                  user.email ||

                  "—"

                }

                hint="Email cannot be changed."

              />



              {/* PHONE IS ALWAYS READ-ONLY */}



              <ReadonlyRow

                label="PHONE"

                value={

                  profile?.phoneNumber ||

                  user.phoneNumber ||

                  "—"

                }

                hint="Phone number cannot be changed."

              />



              <EditableSelectRow

                label="COLLEGE"

                value={form.collegeName}

                options={COLLEGES}

                onChange={(value) =>

                  updateField(

                    "collegeName",

                    value

                  )

                }

              />



              <EditableRow

                label="CITY"

                value={form.city}

                onChange={(value) =>

                  updateField(

                    "city",

                    value

                  )

                }

              />



              <EditableSelectRow

                label="STATE / UT"

                value={form.state}

                options={STATES}

                onChange={(value) =>

                  updateField(

                    "state",

                    value

                  )

                }

                last

              />



              {/* Edit actions */}



              <div

                style={{

                  padding: "24px 40px",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:

                    "flex-end",

                  gap: 12,

                  flexWrap: "wrap",

                }}

              >

                <button

                  type="button"

                  className="button paper"

                  onClick={cancelEditing}

                  disabled={saving}

                  style={{

                    display: "inline-flex",

                    alignItems: "center",

                    gap: 8,

                  }}

                >

                  <X size={15} />

                  CANCEL

                </button>



                <button

                  type="submit"

                  disabled={saving}

                  className="button"

                  style={{

                    display: "inline-flex",

                    alignItems: "center",

                    gap: 9,

                  }}

                >

                  <Save size={15} />



                  {saving

                    ? "SAVING..."

                    : "SAVE CHANGES"}

                </button>

              </div>

            </form>

          )}

        </section>



        {/* =====================================================

            STATUS MESSAGE

        \====================================================== */}



        {(error || message) && (

          <div

            role="status"

            style={{

              marginTop: 20,

              padding: "14px 18px",

              border:

                "1px solid rgba(0,0,0,0.25)",

              fontSize: 13,

              lineHeight: 1.5,

            }}

          >

            {error || message}

          </div>

        )}



        {/* =====================================================

            SECURITY

        \====================================================== */}



        <section

          style={{

            marginTop: 30,

            border:

              "1px solid rgba(0,0,0,0.7)",

            background:

              "var(--paper, #f5eddf)",

          }}

        >

          <div

            style={{

              padding: "24px 40px",

              display: "flex",

              alignItems: "center",

              justifyContent:

                "space-between",

              gap: 20,

              flexWrap: "wrap",

            }}

          >

            <div>

              <div

                className="mono"

                style={{

                  fontSize: 10,

                }}

              >

                SECURITY

              </div>



              <h2

                className="display"

                style={{

                  fontSize: 34,

                  margin:

                    "12px 0 7px",

                }}

              >

                CHANGE PASSWORD

              </h2>



              <p

                style={{

                  margin: 0,

                  fontSize: 13,

                  lineHeight: 1.6,

                  maxWidth: 520,

                  opacity: 0.7,

                }}

              >

                Enter your current password

                before choosing a new one.

              </p>

            </div>



            <button

              type="button"

              className="button paper"

              onClick={() => {

                setShowPasswordPanel(

                  (value) => !value

                );



                setError("");

                setMessage("");

              }}

              style={{

                display: "inline-flex",

                alignItems: "center",

                gap: 9,

              }}

            >

              <LockKeyhole size={15} />



              {showPasswordPanel

                ? "CLOSE"

                : "CHANGE PASSWORD"}

            </button>

          </div>



          {/* Password form */}



          {showPasswordPanel && (

            <form

              onSubmit={changePassword}

              style={{

                borderTop:

                  "1px solid rgba(0,0,0,0.7)",

                padding: 40,

                display: "grid",

                gap: 18,

              }}

            >

              <PasswordField

                label="CURRENT PASSWORD"

                value={currentPassword}

                onChange={

                  setCurrentPassword

                }

                visible={showCurrent}

                onToggle={() =>

                  setShowCurrent(

                    (value) => !value

                  )

                }

                autoComplete="current-password"

              />



              <PasswordField

                label="NEW PASSWORD"

                value={newPassword}

                onChange={setNewPassword}

                visible={showNew}

                onToggle={() =>

                  setShowNew(

                    (value) => !value

                  )

                }

                autoComplete="new-password"

              />



              <PasswordField

                label="CONFIRM NEW PASSWORD"

                value={confirmPassword}

                onChange={

                  setConfirmPassword

                }

                visible={showConfirm}

                onToggle={() =>

                  setShowConfirm(

                    (value) => !value

                  )

                }

                autoComplete="new-password"

              />



              <div

                className="mono"

                style={{

                  fontSize: 9,

                  lineHeight: 1.7,

                  opacity: 0.65,

                }}

              >

                MINIMUM 8 CHARACTERS · AT LEAST

                ONE LETTER · AT LEAST ONE NUMBER

              </div>



              <button

                type="submit"

                className="button"

                disabled={changingPassword}

                style={{

                  width: "fit-content",

                }}

              >

                {changingPassword

                  ? "CHANGING..."

                  : "UPDATE PASSWORD"}

              </button>

            </form>

          )}

        </section>

      </div>

    </main>

  );

}



/* =========================================================
  READ-ONLY ACCOUNT ROW
========================================================= */

function ReadonlyRow({
  label,
  value,
  hint,
  last = false,
}: {
  label: string;
  value: string;
  hint?: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        minHeight: 98,
        display: "grid",
        gridTemplateColumns: "minmax(120px, 260px) minmax(0, 1fr)",
        alignItems: "center",
        borderBottom: last
          ? undefined
          : "1px solid rgba(0,0,0,0.35)",
        padding: "0 40px",
        gap: 25,
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 11,
          minWidth: 0,
        }}
      >
        {label}
      </span>

      <div
        style={{
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 18,
            minWidth: 0,
            maxWidth: "100%",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.35,
          }}
        >
          {value}
        </div>

        {hint && (
          <div
            className="mono"
            style={{
              fontSize: 8,
              marginTop: 5,
              opacity: 0.5,
              maxWidth: "100%",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              whiteSpace: "normal",
              lineHeight: 1.4,
            }}
          >
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}


/* =========================================================
  EDITABLE TEXT ROW
========================================================= */

function EditableRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      style={{
        minHeight: 98,
        display: "grid",
        gridTemplateColumns: "minmax(120px, 260px) minmax(0, 1fr)",
        alignItems: "center",
        borderBottom: "1px solid rgba(0,0,0,0.35)",
        padding: "0 40px",
        gap: 25,
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 11,
          minWidth: 0,
        }}
      >
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          border: 0,
          borderBottom: "1px solid rgba(0,0,0,0.35)",
          background: "transparent",
          padding: "10px 0",
          outline: "none",
          fontSize: 18,
        }}
      />
    </div>
  );
}


/* =========================================================
  EDITABLE SELECT ROW
========================================================= */

function EditableSelectRow({
  label,
  value,
  options,
  onChange,
  last = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  last?: boolean;
}) {
  return (
    <div
      style={{
        minHeight: 98,
        display: "grid",
        gridTemplateColumns: "minmax(120px, 260px) minmax(0, 1fr)",
        alignItems: "center",
        borderBottom: last
          ? undefined
          : "1px solid rgba(0,0,0,0.35)",
        padding: "0 40px",
        gap: 25,
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 11,
          minWidth: 0,
        }}
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={{
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          boxSizing: "border-box",
          border: 0,
          borderBottom: "1px solid rgba(0,0,0,0.35)",
          background: "transparent",
          padding: "10px 0",
          outline: "none",
          fontSize: 18,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <option value="">
          Select {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}


/* =========================================================

   PASSWORD FIELD

\========================================================= */



function PasswordField({

  label,

  value,

  onChange,

  visible,

  onToggle,

  autoComplete,

}: {

  label: string;

  value: string;

  onChange: (value: string) => void;

  visible: boolean;

  onToggle: () => void;

  autoComplete: string;

}) {

  return (

    <label

      style={{

        display: "grid",

        gap: 8,

      }}

    >

      <span

        className="mono"

        style={{

          fontSize: 10,

        }}

      >

        {label}

      </span>



      <div

        style={{

          position: "relative",

        }}

      >

        <input

          type={

            visible

              ? "text"

              : "password"

          }

          value={value}

          onChange={(event) =>

            onChange(

              event.target.value

            )

          }

          autoComplete={autoComplete}

          style={{

            width: "100%",

            boxSizing: "border-box",

            border:

              "1px solid rgba(0,0,0,0.4)",

            background: "transparent",

            padding:

              "13px 48px 13px 14px",

            outline: "none",

            fontSize: 15,

          }}

        />



        <button

          type="button"

          onClick={onToggle}

          aria-label={

            visible

              ? "Hide password"

              : "Show password"

          }

          style={{

            position: "absolute",

            right: 12,

            top: "50%",

            transform:

              "translateY(-50%)",

            border: 0,

            background:

              "transparent",

            cursor: "pointer",

          }}

        >

          {visible ? (

            <EyeOff size={17} />

          ) : (

            <Eye size={17} />

          )}

        </button>

      </div>

    </label>

  );

}