"use client"

import { useUser } from "@clerk/nextjs"
import { useSchematicEvents } from "@schematichq/schematic-react"
import { ReactNode, useEffect } from "react"

const SchematicWrapper = ({ children }: { children: ReactNode }) => {
    const { identify } = useSchematicEvents()
    const { user } = useUser()
    useEffect(() => {
        const userName =
            user?.username ??
            user?.fullName ??
            user?.emailAddresses[0]?.emailAddress ??
            user?.id;
        if (user?.id) {
            identify({
                // Company level 
                company: {
                    keys: {
                        id: user.id
                    },
                    name: userName
                },
                // User level 
                keys: {
                    id: user.id
                },
                name: userName

            })

        }

    }, [user, identify])
    return children;
}

export default SchematicWrapper