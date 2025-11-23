export default function Streak(props) {
  const { streak } = props

  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-5 rounded-xl shadow">
      <h2 className="text-sm">Your Streak 🔥</h2>
      <p className="text-4xl font-bold mt-2">{streak} Days</p>
    </div>
  );
}
