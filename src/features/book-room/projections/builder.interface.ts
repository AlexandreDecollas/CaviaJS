export interface BuilderInterface {
  selector?:
    | { name: 'fromAll' }
    | { name: 'fromCategory'; category: string }
    | 'fromStream'
    | 'fromStreams';
}
