interface HotjarProps {
  hotjarId: string;
  visitorId: string;
  nonce?: string;
}

export const Hotjar = (props: HotjarProps) => {
  const { hotjarId, visitorId } = props;

  const inputProps: { nonce?: string } = {};
  if (props.nonce) {
    inputProps.nonce = props.nonce;
  }
  const hotjarVersion = 6;
  const debug = process.env.NODE_ENV === 'development';

  return (
    <>
      <script
        suppressHydrationWarning
        {...inputProps}
        async
        id={'hotjar-init'}
        dangerouslySetInnerHTML={{
          __html: `(function(h){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:'${hotjarId}',hjsv:${hotjarVersion},hjdebug:${debug}};
          })(window);
          hj('identify', '${visitorId}');
          `
        }}
      />
      <script
        suppressHydrationWarning
        {...inputProps}
        async
        id={'hotjar-script'}
        src={`https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=${hotjarVersion}`}
      />
    </>
  );
};
