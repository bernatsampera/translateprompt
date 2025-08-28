import {addToWaitlist} from "@/api/waitlistApi";
import {MailIcon} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";

const Waitlist = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);

    const response = await addToWaitlist(email);

    toast.success(response.message);
  };
  return (
    <form className="join" onSubmit={handleSubmit}>
      <div>
        <label className="input validator join-item">
          <MailIcon className="h-[1em] opacity-50" />
          <input
            type="email"
            placeholder="mail@site.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <div className="validator-hint hidden">Enter valid email address</div>
      </div>
      <button className="btn btn-neutral join-item" type="submit">
        Join the waitlist
      </button>
    </form>
  );
};

export default Waitlist;
