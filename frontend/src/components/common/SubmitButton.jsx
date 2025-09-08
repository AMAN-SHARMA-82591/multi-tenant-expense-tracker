export default function SubmitButton({ pending }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        pending
          ? "bg-blue-300 text-white px-4 py-2 rounded-mdtransition-colors"
          : "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      }
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
