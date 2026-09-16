type RecipeStatsProps = {
  stats: Array<{
    label: string;
    value: string;
  }>;
};

export function RecipeStats({ stats }: RecipeStatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
      {stats.map(stat => (
        <div key={stat.label} className="rounded-md border bg-background p-3">
          <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
          <dd className="mt-1 text-sm font-semibold">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
