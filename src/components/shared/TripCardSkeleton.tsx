import { Skeleton } from "@mui/material";

type TripCardSkeletonProps = {
  horizontal?: boolean;
};

const TripCardSkeleton = (props: TripCardSkeletonProps) => {
  const { horizontal } = props;

  return (
    <div className="skeleton-card">
      <Skeleton
        variant="rounded"
        sx={{ aspectRatio: 1, height: "auto", width: "100%" }}
      />
      <div className="skeleton-body">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="skeleton-text-content">
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </div>
      </div>
    </div>
  );
};

export default TripCardSkeleton;
