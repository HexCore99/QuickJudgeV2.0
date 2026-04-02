import { CalendarDays, Clock3, History, Layers3 } from "lucide-react";
import Button from "../common/Button";

const iconMap = {
  all: Layers3,
  live: Clock3,
  upcoming: CalendarDays,
  past: History,
};

function ContestFilterBar({
  filters,
  activeFilter,
  setActiveFilter,
  setPastFilter,
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {filters.map(({ key, label }) => {
        const Icon = iconMap[key];

        return (
          <Button
            key={key}
            variant="filter"
            active={activeFilter === key}
            onClick={() => {
              setActiveFilter(key);
              if (key !== "past") setPastFilter("all");
            }}
          >
            <span>{label}</span>
          </Button>
        );
      })}
    </div>
  );
}

export default ContestFilterBar;
