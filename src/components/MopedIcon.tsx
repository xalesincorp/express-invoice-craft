interface MopedIconProps {
  className?: string;
  size?: number;
}

export const MopedIcon = ({ className, size = 32 }: MopedIconProps) => (
              <img src="/lovable-uploads/f36b63fc-4651-413b-a401-23854372b191.png" alt="GoRide Moped Logo" className={className} style={{ width: size, height: size }} />
);