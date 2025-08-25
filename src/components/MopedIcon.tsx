interface MopedIconProps {
  className?: string;
  size?: number;
}

export const MopedIcon = ({ className, size = 32 }: MopedIconProps) => (
  <img 
    src="/lovable-uploads/bc0df6ec-186a-41fb-bd2f-12c2312fd83a.png" 
    alt="GoRide Moped Logo" 
    className={className}
    style={{ width: size, height: size }}
  />
);