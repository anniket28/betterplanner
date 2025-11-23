import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Heatmap(props) {
    const { data } = props

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Activity Heatmap 🔥</h2>

            <CalendarHeatmap
                startDate={new Date(new Date().setMonth(new Date().getMonth() - 5))}
                endDate={new Date()}
                values={data}
                classForValue={value => {
                    if (!value) return "color-empty";
                    if (value.count === 1) return "color-scale-1";
                    if (value.count === 2) return "color-scale-2";
                    if (value.count === 3) return "color-scale-3";
                    return "color-scale-4";
                }}
            />
        </div>
    );
}
