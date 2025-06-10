
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 mr-1 text-green-500" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1 text-red-500" />
          <span>Connecting...</span>
        </>
      )}
    </div>
  );
}
