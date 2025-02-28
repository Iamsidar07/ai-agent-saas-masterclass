import SchematicComponent from "@/components/schematic/SchematicComponent";
import { SquaresPattern } from "@/components/SquarePattern";

export default function ManagePlan() {
  return (
    <div className="relative">
      <SquaresPattern />
      <div className="container mx-auto p-4 md:p-0">
        <h1 className="text-2xl sm:text-4xl my-8">Manage your plan</h1>
        <p className="text-muted-foreground mb-8">Manage your billing and subscription details here</p>
        <SchematicComponent componentId="cmpn_bV4hy3PgJXH" />
      </div>
    </div>
  )
}
