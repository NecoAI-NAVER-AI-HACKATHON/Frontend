interface NodeLabelProps {
  category: string;
  className?: string;
}

const NodeLabel = ({ category, className = "" }: NodeLabelProps) => {
  return (
    <div className={`text-xs font-medium text-gray-500 uppercase tracking-wide ${className}`}>
      {category}
    </div>
  );
};

export default NodeLabel;

