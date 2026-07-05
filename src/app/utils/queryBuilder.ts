export const buildQueryOptions = (
  query: Record<string, string | undefined>,
  searchableFields: string[],
) => {
  const searchTerm = query.search?.trim();
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder === "desc" ? -1 : 1;

  const filter: Record<string, unknown> = {};

  if (searchTerm) {
    filter.$or = searchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice) {
    filter.purchasePrice = { $gte: Number(query.minPrice) };
  }

  if (query.maxPrice) {
    filter.sellingPrice = { $lte: Number(query.maxPrice) };
  }

  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder as 1 | -1 };

  return {
    filter,
    page: Number.isNaN(page) ? 1 : page,
    limit: Number.isNaN(limit) ? 10 : limit,
    sort,
    skip,
  };
};

export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number,
) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
