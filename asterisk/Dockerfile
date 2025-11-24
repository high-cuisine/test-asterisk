FROM andrius/asterisk:latest

USER root

COPY configs/ /etc/asterisk/

RUN mkdir -p /var/log/asterisk /var/spool/asterisk /var/lib/asterisk /var/run/asterisk && \
    chown -R asterisk:asterisk /var/log/asterisk /var/spool/asterisk /var/lib/asterisk /var/run/asterisk && \
    chmod -R 755 /var/log/asterisk /var/spool/asterisk /var/lib/asterisk /var/run/asterisk

EXPOSE 5060/udp 5060/tcp 10000-20000/udp 5038/tcp

CMD ["asterisk", "-f", "-vvv", "-g", "-c"]

