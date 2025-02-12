export function Paginate<T>(
  data: T[],
  skip: number,
  take: number,
): {
  data: T[];
  hasMore: boolean;
  pagination: { take: number; skip: number } | null;
} {
  const hasMore = data.length > take;
  const updatedData = data.slice(0, take);
  return {
    data: updatedData,
    hasMore,
    pagination: hasMore ? { take, skip: skip + take } : null,
  };
}
