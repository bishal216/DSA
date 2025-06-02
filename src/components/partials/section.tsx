import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { iconMap } from '@/context/iconmap';
import { SectionProps } from '@/context/types';
export default function Section({ title, items, sectionID }: SectionProps) {
    const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {});

    return (
        <div id={sectionID} className="mb-24 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">{title}</h2>

            {Object.entries(groupedItems).map(([group, groupItems]) => (
                <div key={group} className="mb-10">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 capitalize">
                        {group.replace(/-/g, ' ')}
                    </h3>

                    <div className="flex flex-wrap justify-start gap-4">
                        {groupItems.map((item) => {
                            const Icon = iconMap[item.icon];

                            return (
                                <Link
                                    to={item.path}
                                    key={item.title}
                                    className="block aspect-square max-w-28 min-w-28" // limit the size!
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full h-full flex flex-col items-center justify-center gap-1 rounded-lg shadow-sm hover:shadow-md p-2 bg-card text-card-foreground hover:scale-[1.02] transition-transform"
                                    >
                                        <div className="w-8 h-8 rounded-sm flex items-center justify-center">
                                            <Icon className="w-6 h-6 stroke-black fill-none" strokeWidth={2} />
                                        </div>



                                        <span className="text-xs font-medium text-center break-words">
                                            {item.title}
                                        </span>
                                    </Button>


                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Section-wide separator */}
            <hr className="mt-16 border-gray-300" />
        </div>
    );
}

