interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export default function DashboardCard({
  title,
  value,
  change,
  isPositive,
}: DashboardCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <p className="text-gray-500 text-sm">{title}</p>
      <div className="flex justify-between items-end mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span
          className={`text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
