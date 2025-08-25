interface MopedIconProps {
  className?: string;
  size?: number;
}

export const MopedIcon = ({ className, size = 32 }: MopedIconProps) => (
              <img src="/lovable-uploads/d6212715-6208-45ef-90d4-67a2d5f5d205.png" alt="GoRide Moped Logo" className={className} style={{ width: size, height: size }} />
);